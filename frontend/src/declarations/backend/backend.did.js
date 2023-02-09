export const idlFactory = ({ IDL }) => {
  return IDL.Service({ 'hello_world' : IDL.Func([], [IDL.Text], []) });
};
export const init = ({ IDL }) => { return []; };
