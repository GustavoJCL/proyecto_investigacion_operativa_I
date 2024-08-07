import { writable } from "svelte/store";
import { OptionsAlgorithm } from "./utils/state";

export let algorithmOptions = writable(OptionsAlgorithm.Modi);
