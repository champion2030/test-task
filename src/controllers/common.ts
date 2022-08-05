import { Container } from 'typedi';
import { Validator } from 'class-validator';

export async function validateDTO(dto: object) {
  const validator = Container.get(Validator);
  const validationErrors = await validator.validate(dto);

  if (validationErrors.length) {
    throw validationErrors;
  }
}
