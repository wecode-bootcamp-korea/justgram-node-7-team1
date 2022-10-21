// const validateToken = async(req, res, next) => {
//     // 3. get token from header
//     const { token } = req.headers

//     if (!token) {
//       const error = new Error('UNAUTHORIZED')
//       error.statusCode = 401 // unauthorized
//       throw error
//     }

//     // 4. if token ==> jwt.verify

//     const user = jwt.verify(token, process.env.SECRET_KEY)
//     const userId = user.id // 36

// 		// 5. 해당 userId를 가진 유저가 실제로 존재하는지 .

//     const user = await myDat
// }