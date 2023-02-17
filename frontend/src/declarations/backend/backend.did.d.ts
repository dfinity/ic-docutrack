import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export type download_file_response = { 'found_file' : found_file } |
  { 'permission_error' : null } |
  { 'not_uploaded_file' : null } |
  { 'not_found_file' : null };
export interface file {
  'contents' : [] | [Uint8Array],
  'metadata' : file_metadata,
}
export type file_id = bigint;
export interface file_metadata {
  'file_status' : file_status,
  'file_name' : string,
  'shared_with' : Array<user>,
  'file_id' : file_id,
}
export type file_status = {
    'pending' : { 'alias' : string, 'requested_at' : bigint }
  } |
  { 'uploaded' : { 'document_key' : Uint8Array, 'uploaded_at' : bigint } };
export interface found_file {
  'contents' : Uint8Array,
  'owner_key' : Uint8Array,
  'file_type' : string,
}
export type get_alias_info_response = {
    'Ok' : { 'user' : user, 'file_name' : string, 'file_id' : file_id }
  } |
  { 'Err' : { 'not_found' : null } };
export type get_users_response = { 'permission_error' : null } |
  { 'users' : Array<user> };
export type share_file_response = { 'ok' : null } |
  { 'permission_error' : null };
export interface upload_file_atomic_request {
  'content' : Uint8Array,
  'owner_key' : Uint8Array,
  'name' : string,
}
export type upload_file_error = { 'not_requested' : null } |
  { 'already_uploaded' : null };
export interface upload_file_request {
  'owner_key' : Uint8Array,
  'file_type' : string,
  'file_content' : Uint8Array,
  'file_id' : file_id,
}
export type upload_file_response = { 'Ok' : null } |
  { 'Err' : upload_file_error };
export interface user {
  'public_key' : Uint8Array,
  'ic_principal' : Principal,
  'first_name' : string,
  'last_name' : string,
}
export type who_am_i_response = {
    'known_user' : { 'first_name' : string, 'last_name' : string }
  } |
  { 'unknown_user' : null };
export interface _SERVICE {
  'download_file' : ActorMethod<[file_id], download_file_response>,
  'get_alias_info' : ActorMethod<[string], get_alias_info_response>,
  'get_requests' : ActorMethod<[], Array<file_metadata>>,
  'get_shared_files' : ActorMethod<[], Array<file_metadata>>,
  'get_users' : ActorMethod<[], get_users_response>,
  'hello_world' : ActorMethod<[], string>,
  'request_file' : ActorMethod<[string], string>,
  'set_user' : ActorMethod<[string, string, Uint8Array], undefined>,
  'share_file' : ActorMethod<
    [Principal, file_id, Uint8Array],
    share_file_response
  >,
  'share_file_with_users' : ActorMethod<
    [Array<Principal>, file_id, Array<Uint8Array>],
    undefined
  >,
  'upload_file' : ActorMethod<[upload_file_request], upload_file_response>,
  'upload_file_atomic' : ActorMethod<[upload_file_atomic_request], undefined>,
  'who_am_i' : ActorMethod<[], who_am_i_response>,
}
