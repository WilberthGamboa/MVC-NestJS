import { v4 as uuid } from 'uuid';

export const fileNamer = (fileExtension: string) => {
  const fileName = `${uuid()}.${fileExtension}`;

  return fileName;
};
