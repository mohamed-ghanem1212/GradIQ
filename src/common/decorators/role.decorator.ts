import { Role } from '@modules/users/interface/user.interface';
import { SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export const ROLES_KEY = 'roles';

export const Roles = (...roles: Role[]) => {
  SetMetadata(ROLES_KEY, roles);
};
