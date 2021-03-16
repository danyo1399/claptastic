export function tryAction(action: () => any) {
    try {
        action()
    } catch (err) {
        return err
    }
}
