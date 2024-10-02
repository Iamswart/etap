import { Role } from "../interfaces/constant";


export class JWTUser {
  readonly id: string;
  readonly role: Role;

  constructor(details: { id: string; role: Role }) {
    this.id = details.id;
    this.role = details.role;
  }

  getId(): string {
    return this.id;
  }

  getRole(): Role {
    return this.role;
  }

  isAdmin(): boolean {
    return this.role === Role.ADMIN;
  }

  isTeacher(): boolean {
    return this.role === Role.TEACHER;
  }

  isStudent(): boolean {
    return this.role === Role.STUDENT;
  }
}