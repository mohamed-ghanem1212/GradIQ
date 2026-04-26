import { AuthGuard } from '@nestjs/passport';

export class GitHubGuard extends AuthGuard('github') {}
