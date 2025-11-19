type System = {
  RegisterForOnResumeFromSuspend?: (callback: () => void) => Unregisterer;
}
