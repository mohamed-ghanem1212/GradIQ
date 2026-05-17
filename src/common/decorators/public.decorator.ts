import { Role } from '@modules/users/interface/user.interface';
import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC = 'public';

export const IsPublic = () => SetMetadata(IS_PUBLIC, true);
