// Asynchronous route handlers ke errors ko handle karne ke liye
const asyncHandler = (reqHandler) => {
  return (req, res, next) => {
    Promise
    .resolve(reqHandler(req, res, next))
    .catch((err) => next(err));
  };
};

export { asyncHandler };

// Humne yahan Promise ka use isliye kiya hai taaki .catch() method se errors ko handle kar sakein.
// Is function ka main kaam ye hai ki hume controllers me baar-baar try-catch blocks likhne ki zarurat na pade.
//------------------------------------------
// const asyncHandler = (fn) => async (req, res, next) => {               //higher order functions
//     try {
//         await fn(req, res, next)
//     } catch (error) {
//         res.status(error.code || 500).json({
//             success: false,
//             message: error.message
//         })
//     }
// }
