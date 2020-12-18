export default interface FieldValitation {
  field: string
  validate: (value: string) => Error
}
