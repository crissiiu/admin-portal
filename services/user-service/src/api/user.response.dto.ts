import type { UserProfile } from "../domain/entities/user-profile.entity.js";

export function toUserProfileResponse(profile: UserProfile) {
  return {
    id: profile.id,
    authUserId: profile.authUserId,
    name: profile.name,
    email: profile.email,
    phoneNumber: profile.phoneNumber,
    bio: profile.bio,
    status: profile.status
  };
}
