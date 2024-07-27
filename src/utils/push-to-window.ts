export function pushToWindow(propertyName: string, value: any): void {
  (window as any)[propertyName] = value;
}
