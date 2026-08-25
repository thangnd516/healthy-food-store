# be-healthy-food-store
Meal Ordering Backend API

Backend REST API cho hệ thống đặt món ăn / meal kit, xây dựng bằng Node.js + Express + MongoDB (Mongoose). Hệ thống hỗ trợ quản lý người dùng, món ăn (meal), nguyên liệu (ingredient), giỏ hàng, đơn hàng, thanh toán và thống kê doanh thu.

Công nghệ sử dụng
Node.js / Express – xử lý routing và middleware
MongoDB / Mongoose – lưu trữ dữ liệu (User, Meal, Ingredient, Order, ImageMeal)
JWT (jsonwebtoken) – xác thực bằng access token & refresh token
bcrypt – mã hoá mật khẩu
express-async-handler – bắt lỗi async gọn hơn
crypto – tạo/hash token reset mật khẩu
Gửi email (sendMail util) – dùng cho luồng quên mật khẩu
Cấu trúc chức năng
1. Xác thực & người dùng (user.controller)
register – đăng ký tài khoản (kiểm tra trùng email/username)
login – đăng nhập, trả về accessToken, lưu refreshToken vào cookie httpOnly
getUserCurrent – lấy thông tin user đang đăng nhập
forgotPassword / changePassword – quên mật khẩu qua email, đổi mật khẩu bằng reset token (hash SHA-256, hết hạn 15 phút)
updatePassword – đổi mật khẩu khi đã đăng nhập (so khớp mật khẩu cũ bằng bcrypt)
getAllUser / getUserWithFilter – danh sách user có phân trang, lọc theo email (regex)
createUser / updateUser / deleteUser – CRUD user (dành cho admin)
updateProfile – cập nhật hồ sơ, hỗ trợ upload avatar
getUser – lấy chi tiết 1 user kèm giỏ hàng (populate cart.meal)
2. Giỏ hàng (trong user.controller)
addIngredientToCart – thêm nguyên liệu vào giỏ, cộng dồn số lượng nếu đã tồn tại
addMealToCart – thêm món ăn vào giỏ, hỗ trợ action add (cộng dồn) hoặc update (ghi đè số lượng)
removeMealFromCart – xoá 1 món khỏi giỏ
removeAllMealFromCart – xoá toàn bộ giỏ hàng
addMealRecommend – thêm món vào danh sách gợi ý cho user
buyNow – tạo đơn hàng trực tiếp từ 1 sản phẩm, trừ tồn kho món ăn tương ứng
3. Món ăn (meal.controller)
createMeal / createMealRecommend – tạo món ăn mới (kiểm tra trùng tên)
updateMeal – cập nhật món ăn, hỗ trợ upload ảnh
getAllMeal / getMealWithFilter – danh sách món ăn có phân trang, lọc theo tên
getMeal – chi tiết món ăn, populate danh sách nguyên liệu
deleteMeal – xoá món ăn
4. Nguyên liệu (ingredient.controller)
createIngredient – tạo nguyên liệu, hỗ trợ upload ảnh (kiểm tra trùng tên)
updateIngredient – cập nhật nguyên liệu
getAllIngredient / getIngredientWithFilter – danh sách có phân trang, lọc theo tên
getIngredient – chi tiết 1 nguyên liệu
deleteIngredient – xoá nguyên liệu
getAllIngredientWithoutPagination – lấy toàn bộ danh sách không phân trang (dùng cho dropdown/select)
5. Đơn hàng (order.controller)
getAllOrder / getAllOrderWithFilter – danh sách đơn hàng có phân trang, lọc theo tên, populate thông tin user
updateStatus – cập nhật trạng thái đơn hàng; nếu chuyển sang Cancelled thì hoàn lại số lượng tồn kho món ăn
getIdOrder – lấy chi tiết đơn hàng theo id
getAllOrderByUser – danh sách đơn hàng của 1 user cụ thể
6. Thanh toán & thống kê (payment.controller)
paymentDirect – tạo đơn hàng từ giỏ hàng hiện tại của user, kiểm tra tồn kho trước khi đặt, trừ số lượng món ăn sau khi tạo đơn
getStatistical – thống kê doanh thu theo ngày / tuần / tháng / năm (mặc định 7 ngày gần nhất), chỉ tính đơn có trạng thái Success
7. Ảnh món ăn (imagemeal.controller)
createImageForMeal – tạo bản ghi ảnh cho món ăn, hỗ trợ upload file
Models liên quan
User: thông tin tài khoản, role, cart, mealRecommend, refreshToken, các trường reset mật khẩu
Meal: món ăn, có quantity (tồn kho), danh sách ingredients
Ingredient: nguyên liệu, có trường deletedAt (soft delete)
Order: đơn hàng, có status, product (danh sách món + số lượng), dateOrder
ImageMeal: ảnh gắn với món ăn
Phân trang & lọc dữ liệu

Hầu hết các API danh sách (getAll...) đều dùng chung một pattern:

Loại bỏ các field đặc biệt (limit, sort, page, fields) khỏi query
Chuyển các toán tử gte/gt/lt/lte sang cú pháp Mongoose ($gte, $gt, ...)
Phân trang bằng page, limit (mặc định lấy từ biến môi trường LIMIT_PER_PAGE / LIMIT_PRODUCT)
Bản ...WithFilter hỗ trợ thêm tìm kiếm gần đúng theo tên bằng regex ($options: "i")
Biến môi trường cần thiết
URL_SERVER=
LIMIT_PER_PAGE=
LIMIT_PRODUCT=
JWT_SECRET / JWT_REFRESH_SECRET (dùng trong middlewares/jwt)
Cấu hình gửi mail (dùng trong utils/sendMail)
Cấu hình kết nối MongoDB
Ghi chú / vấn đề cần lưu ý khi phát triển tiếp
getAllIngredient: đang truyền formatedQueries như một field lồng trong object filter ({ deletedAt: null, formatedQueries }) thay vì spread ...formatedQueries — nên kiểm tra lại logic này vì có thể không lọc đúng.
changePassword không await khi gọi user.save() — nên thêm await để đảm bảo dữ liệu được lưu trước khi trả response.
getIdOrder trong order.controller dùng historyOrder.findById nhưng model được import ở đầu file là Order — có thể là lỗi đặt tên biến, nên đổi thành Order.findById.
Nhiều đoạn code bị comment lại (trừ tồn kho khi thêm vào giỏ) — cân nhắc dọn dẹp hoặc bật lại tuỳ theo nghiệp vụ mong muốn.
Trong login, biến password bị destructure từ response.toObject() rồi shadow lại tên với password lấy từ req.body — cần kiểm tra kỹ vì có thể gây nhầm lẫn biến.