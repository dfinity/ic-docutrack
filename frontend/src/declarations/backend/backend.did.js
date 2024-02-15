export const idlFactory = ({ IDL }) => {
  const file_id = IDL.Nat64;
  const found_file = IDL.Record({
    'contents' : IDL.Vec(IDL.Nat8),
    'owner_key' : IDL.Vec(IDL.Nat8),
    'file_type' : IDL.Text,
    'num_chunks' : IDL.Nat64,
  });
  const download_file_response = IDL.Variant({
    'found_file' : found_file,
    'permission_error' : IDL.Null,
    'not_uploaded_file' : IDL.Null,
    'not_found_file' : IDL.Null,
  });
  const user = IDL.Record({
    'public_key' : IDL.Vec(IDL.Nat8),
    'ic_principal' : IDL.Principal,
    'username' : IDL.Text,
  });
  const get_alias_info_response = IDL.Variant({
    'Ok' : IDL.Record({
      'user' : user,
      'file_name' : IDL.Text,
      'file_id' : file_id,
    }),
    'Err' : IDL.Variant({ 'not_found' : IDL.Null }),
  });
  const file_status = IDL.Variant({
    'partially_uploaded' : IDL.Null,
    'pending' : IDL.Record({ 'alias' : IDL.Text, 'requested_at' : IDL.Nat64 }),
    'uploaded' : IDL.Record({
      'document_key' : IDL.Vec(IDL.Nat8),
      'uploaded_at' : IDL.Nat64,
    }),
  });
  const file_metadata = IDL.Record({
    'file_status' : file_status,
    'file_name' : IDL.Text,
    'shared_with' : IDL.Vec(user),
    'file_id' : file_id,
  });
  const get_users_response = IDL.Variant({
    'permission_error' : IDL.Null,
    'users' : IDL.Vec(user),
  });
  const share_file_response = IDL.Variant({
    'ok' : IDL.Null,
    'permission_error' : IDL.Null,
  });
  const upload_file_request = IDL.Record({
    'owner_key' : IDL.Vec(IDL.Nat8),
    'file_type' : IDL.Text,
    'num_chunks' : IDL.Nat64,
    'file_content' : IDL.Vec(IDL.Nat8),
    'file_id' : file_id,
  });
  const upload_file_error = IDL.Variant({
    'not_requested' : IDL.Null,
    'already_uploaded' : IDL.Null,
  });
  const upload_file_response = IDL.Variant({
    'Ok' : IDL.Null,
    'Err' : upload_file_error,
  });
  const upload_file_atomic_request = IDL.Record({
    'content' : IDL.Vec(IDL.Nat8),
    'owner_key' : IDL.Vec(IDL.Nat8),
    'name' : IDL.Text,
    'file_type' : IDL.Text,
    'num_chunks' : IDL.Nat64,
  });
  const upload_file_continue_request = IDL.Record({
    'contents' : IDL.Vec(IDL.Nat8),
    'chunk_id' : IDL.Nat64,
    'file_id' : file_id,
  });
  const who_am_i_response = IDL.Variant({
    'known_user' : IDL.Record({
      'username' : IDL.Text,
    }),
    'unknown_user' : IDL.Null,
  });
  const set_user_response = IDL.Variant({
      'ok' : IDL.Null,
      'username_exists' : IDL.Null,
  }); 
  return IDL.Service({
    'download_file' : IDL.Func(
        [file_id, IDL.Nat64],
        [download_file_response],
        ['query'],
      ),
    'get_alias_info' : IDL.Func(
        [IDL.Text],
        [get_alias_info_response],
        ['query'],
      ),
    'get_requests' : IDL.Func([], [IDL.Vec(file_metadata)], ['query']),
    'get_shared_files' : IDL.Func([], [IDL.Vec(file_metadata)], ['query']),
    'get_users' : IDL.Func([], [get_users_response], ['query']),
    'hello_world' : IDL.Func([], [IDL.Text], []),
    'request_file' : IDL.Func([IDL.Text], [IDL.Text], []),
    'revoke_share' : IDL.Func(
        [IDL.Principal, file_id],
        [share_file_response],
        [],
      ),
    'set_user' : IDL.Func([IDL.Text, IDL.Vec(IDL.Nat8)], [set_user_response], []),
    'share_file' : IDL.Func(
        [IDL.Principal, file_id, IDL.Vec(IDL.Nat8)],
        [share_file_response],
        [],
      ),
    'share_file_with_users' : IDL.Func(
        [IDL.Vec(IDL.Principal), file_id, IDL.Vec(IDL.Vec(IDL.Nat8))],
        [],
        [],
      ),
    'upload_file' : IDL.Func([upload_file_request], [upload_file_response], []),
    'upload_file_atomic' : IDL.Func(
        [upload_file_atomic_request],
        [file_id],
        [],
      ),
    'upload_file_continue' : IDL.Func([upload_file_continue_request], [], []),
    'username_exists' : IDL.Func([IDL.Text], [IDL.Bool], ['query']),
    'who_am_i' : IDL.Func([], [who_am_i_response], ['query']),
  });
};
export const init = ({ IDL }) => { return []; };
