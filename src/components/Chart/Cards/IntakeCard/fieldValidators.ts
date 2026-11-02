type ValidationInput<T> = { value: T };

export function onBlurAndSubmit<T>(
  validate: (value: T) => string | undefined,
) {
  const runValidation = ({ value }: ValidationInput<T>) => validate(value);
  return { onBlur: runValidation, onSubmit: runValidation };
}
