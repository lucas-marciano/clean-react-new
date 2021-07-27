export default interface FieldValitation {
  field: string
  validate: (input: object) => Error
}
