import { Action, PayloadAction } from "./action";
import { createActionBuilder } from "./actionBuilder";
import { BasicStore } from "./basicStore";
import {
  InferActionCreatorFromAction,
  InferActionCreatorMapFromReducerMap,
  InferActionDispatcherFromReducerMap,
  InferActionReducerMapFromReducerMap,
  InferPayloadFromPayloadAction,
  InferTypeFromAction,
  InferTypeFromActionCreator,
  InferTypeFromActionReducer
} from "./utilityTypes";

const actionA: Action<"Action A"> = { type: "Action A" };

const actionB: PayloadAction<{ value: number }, "Action B"> = {
  type: "Action B",
  payload: { value: 5 }
};

// InferTypeFromAction works.
let inferredActionAType: InferTypeFromAction<typeof actionA>;
let inferredActionBType: InferTypeFromAction<typeof actionB>;

// InferPayloadFromPayloadAction works.
let inferredActionBPayload: InferPayloadFromPayloadAction<typeof actionB>;

// InferActionCreatorFromAction works.
let inferredActionAActionCreator: InferActionCreatorFromAction<typeof actionA>;
let inferredActionBActionCreator: InferActionCreatorFromAction<typeof actionB>;

const context = createActionBuilder<{ color: string }>();
const reducerMapA = {
  actionC: context.createReducer.withoutPayload((getState) => getState()),
  actionD: context.createReducer.withPayload<string>((getState, color) => {
    const state = getState();
    state.color = color;
    return state;
  }),
  actionE: context.createReducer.withPayload<{
    value: number;
    active: boolean;
  }>((getState, payload) => getState())
};

const dispatchContext = context.withReducers<typeof reducerMapA>();

const reducerMapB = {
  actionF: dispatchContext.createReducer.withPayload(
    async (getState, payload: { newColor: string }, dispatch) => {
      const { actionD } = dispatch.actions;
      await dispatch.dispatch(actionD(payload.newColor)); // Dispatch and await another action within this one.
      return getState();
    }
  ),
  actionG: dispatchContext.createReducer.withoutPayload((getState) =>
    getState()
  )
};

const combinedReducers = { ...reducerMapA, ...reducerMapB };

// InferActionCreatorMapFromReducerMap works
let inferredReducerMapAActionCreators: InferActionCreatorMapFromReducerMap<typeof reducerMapA>;
let inferredReducerMapAActionCreatorsCombined: InferActionCreatorMapFromReducerMap<typeof combinedReducers>;

// InferActionReducerMapFromReducerMap works
let inferredReducerMapAActionReducers: InferActionReducerMapFromReducerMap<typeof reducerMapA>;
let inferredReducerMapAActionReducersCombined: InferActionReducerMapFromReducerMap<typeof combinedReducers>;

const builtActionCreatorMap = context.createActionCreatorMap(reducerMapA);
const builtActionCreatorMapCombined = context.createActionCreatorMap(
  combinedReducers
);
const builtActionReducerMap = context.createActionReducerMap(reducerMapA);
const builtActionReducerMapCombined = context.createActionReducerMap(
  combinedReducers
);

// Injected dispatch works.
builtActionReducerMapCombined.actionG.reducer = (getState, dispatch) => {
  const state = getState();

  // Should expect only actionC, actionD, and actionE
  const { actionC, actionD, actionE } = dispatch.actions;
  return state;
};

// InferTypeFromActionCreator works
let inferredTypeFromActionCreator: InferTypeFromActionCreator<typeof builtActionCreatorMap.actionC>;
let inferredTypeFromActionCreatorCombined: InferTypeFromActionCreator<typeof builtActionCreatorMapCombined.actionC>;

// InferTypeFromActionReducer works
let inferredTypeFromActionReducer: InferTypeFromActionReducer<typeof builtActionReducerMap.actionC>;
let inferredTypeFromActionReducerCombined: InferTypeFromActionReducer<typeof builtActionReducerMapCombined.actionC>;

// InferActionDispatcherFromReducerMap works
let inferredActionDispatcherFromReducerMap: InferActionDispatcherFromReducerMap<typeof reducerMapA>;
let inferredActionDispatcherFromReducerMapCombined: InferActionDispatcherFromReducerMap<typeof combinedReducers>;

interface TestState {
  color: string;
  value: number;
  active: boolean;
}

const builder = createActionBuilder<TestState>();

const colorActions = {
  changeColor: builder.createReducer.withPayload<string>((getState, color) => {
    const state = getState();
    state.color = color;
    return state;
  })
};

const valueActions = {
  changeValue: builder.createReducer.withPayload<number>((getState, value) => {
    const state = getState();
    state.value = value;
    return state;
  })
};

const defaultState: TestState = {
  color: "red",
  value: 10,
  active: false
};

const mergedActions = { ...colorActions, ...valueActions };

const testStore = new BasicStore(defaultState, mergedActions);

const { changeColor, changeValue } = testStore.actions;
