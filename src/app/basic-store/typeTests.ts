import { Action, PayloadAction } from "./action";
import { createActionBuilder } from "./actionBuilder";
import {
  InferActionCreatorFromAction,
  InferActionCreatorMapFromReducerMap,
  InferActionReducerMapFromReducerMap,
  InferPayloadFromPayloadAction,
  InferTypeFromAction
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

// InferActionCreatorMapFromReducerMap works
let inferredReducerMapAActionCreators: InferActionCreatorMapFromReducerMap<typeof reducerMapA>;

// InferActionReducerMapFromReducerMap works
let inferredReducerMapAActionReducers: InferActionReducerMapFromReducerMap<typeof reducerMapA>;
