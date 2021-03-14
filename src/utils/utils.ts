import any = jasmine.any;

export function tryAction(action: () => any) {
  try {
    action();
  } catch (err) {}
}
