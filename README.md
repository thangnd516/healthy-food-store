# healthy-food-store
Hệ thống quản lý người dùng, món ăn, nguyên liệu, giỏ hàng, đơn hàng, thanh toán và thống kê doanh thu.

Công nghệ sử dụng
Node.js / Express – routing & middleware
MongoDB / Mongoose – lưu trữ dữ liệu (User, Meal, Ingredient, Order, ImageMeal)
JWT (jsonwebtoken) – access token & refresh token
bcrypt – mã hoá mật khẩu
express-async-handler – bắt lỗi async gọn hơn
crypto – hash token reset mật khẩu (SHA-256)
Gửi email (utils/sendMail) – cho luồng quên mật khẩu
Upload file (req.file.path, dùng cho avatar, ảnh món ăn, ảnh nguyên liệu)
Cấu trúc module
controllers/
├── user.controller.js        # Auth, quản lý user, giỏ hàng
├── meal.controller.js         # CRUD món ăn
├── ingredient.controller.js   # CRUD nguyên liệu
├── order.controller.js        # Quản lý đơn hàng
├── payment.controller.js      # Thanh toán & thống kê doanh thu
└── imagemeal.controller.js    # Ảnh gắn với món ăn
1. Xác thực & người dùng (user.controller)
Hàm	Chức năng
register	Đăng ký tài khoản (kiểm tra trùng email/username)
login	Đăng nhập, trả accessToken, lưu refreshToken vào cookie httpOnly
getUserCurrent	Lấy thông tin user đang đăng nhập
forgotPassword	Gửi email reset mật khẩu, token hết hạn sau 15 phút
changePassword	Đổi mật khẩu bằng reset token (hash SHA-256)
updatePassword	Đổi mật khẩu khi đã đăng nhập (so khớp mật khẩu cũ bằng bcrypt)
getAllUser / getUserWithFilter	Danh sách user, phân trang, lọc theo email (regex)
createUser / updateUser / deleteUser	CRUD user (admin)
updateProfile	Cập nhật hồ sơ, hỗ trợ upload avatar
getUser	Chi tiết user, populate cart.meal
2. Giỏ hàng (trong user.controller)
Hàm	Chức năng
addIngredientToCart	Thêm nguyên liệu vào giỏ, cộng dồn số lượng nếu đã có
addMealToCart	Thêm món vào giỏ, action add (cộng dồn) hoặc update (ghi đè)
removeMealFromCart	Xoá 1 món khỏi giỏ
removeAllMealFromCart	Xoá toàn bộ giỏ hàng
addMealRecommend	Thêm món vào danh sách gợi ý cho user
buyNow	Tạo đơn hàng trực tiếp từ 1 sản phẩm, trừ tồn kho tương ứng
3. Món ăn (meal.controller)
Hàm	Chức năng
createMeal / createMealRecommend	Tạo món ăn mới (kiểm tra trùng tên)
updateMeal	Cập nhật món ăn, hỗ trợ upload ảnh
getAllMeal / getMealWithFilter	Danh sách phân trang, lọc theo tên
getMeal	Chi tiết món ăn, populate nguyên liệu
deleteMeal	Xoá món ăn
4. Nguyên liệu (ingredient.controller)
Hàm	Chức năng
createIngredient	Tạo nguyên liệu, hỗ trợ upload ảnh (kiểm tra trùng tên)
updateIngredient	Cập nhật nguyên liệu
getAllIngredient / getIngredientWithFilter	Danh sách phân trang, lọc theo tên
getIngredient	Chi tiết 1 nguyên liệu
deleteIngredient	Xoá nguyên liệu
getAllIngredientWithoutPagination	Lấy toàn bộ danh sách (dùng cho dropdown)
5. Đơn hàng (order.controller)
Hàm	Chức năng
getAllOrder / getAllOrderWithFilter	Danh sách đơn hàng, phân trang, lọc theo tên, populate user
updateStatus	Cập nhật trạng thái đơn; nếu Cancelled thì hoàn tồn kho món ăn
getIdOrder	Chi tiết đơn hàng theo id
getAllOrderByUser	Danh sách đơn hàng của 1 user
6. Thanh toán & thống kê (payment.controller)
Hàm	Chức năng
paymentDirect	Tạo đơn hàng từ giỏ hàng hiện tại, kiểm tra tồn kho trước khi đặt, trừ tồn kho sau khi tạo đơn
getStatistical	Thống kê doanh thu theo ngày/tuần/tháng/năm (mặc định 7 ngày gần nhất), chỉ tính đơn Success
7. Ảnh món ăn (imagemeal.controller)
Hàm	Chức năng
createImageForMeal	Tạo bản ghi ảnh cho món ăn, hỗ trợ upload file
Models liên quan
User: tài khoản, role, cart, mealRecommend, refreshToken, các trường reset mật khẩu
Meal: món ăn, quantity (tồn kho), danh sách ingredients
Ingredient: nguyên liệu, có deletedAt (soft delete)
Order: đơn hàng, status, product (danh sách món + số lượng), dateOrder
ImageMeal: ảnh gắn với món ăn
Phân trang & lọc dữ liệu (pattern dùng chung)

Hầu hết API danh sách (getAll...) đều theo cùng một pattern:

Loại field đặc biệt (limit, sort, page, fields) khỏi query
Chuyển toán tử gte/gt/lt/lte sang cú pháp Mongoose ($gte, $gt, ...)
Phân trang bằng page, limit (mặc định lấy từ biến môi trường LIMIT_PER_PAGE / LIMIT_PRODUCT)
Bản ...WithFilter hỗ trợ tìm kiếm gần đúng theo tên bằng regex ($options: "i")
Luồng nghiệp vụ chính

Đặt món qua giỏ hàng: addMealToCart → paymentDirect (kiểm tra tồn kho, tạo Order, trừ tồn kho Meal)

Mua ngay không qua giỏ: buyNow (tạo Order trực tiếp, trừ tồn kho tương ứng)

Huỷ đơn: updateStatus với status = "Cancelled" → hoàn lại tồn kho các món trong đơn

Thống kê doanh thu: getStatistical lọc theo khoảng thời gian, cộng dồn price các đơn có status = "Success"

Biến môi trường cần thiết
URL_SERVER=
LIMIT_PER_PAGE=
LIMIT_PRODUCT=
JWT_SECRET / JWT_REFRESH_SECRET   # dùng trong middlewares/jwt
MONGODB_URI                        # kết nối MongoDB
Cấu hình gửi mail                  # dùng trong utils/sendMail
Ghi chú / vấn đề cần lưu ý khi phát triển tiếp
getAllIngredient: đang truyền formatedQueries như field lồng trong object filter ({ deletedAt: null, formatedQueries }) thay vì spread ...formatedQueries — kiểm tra lại vì có thể không lọc đúng.
changePassword: thiếu await khi gọi user.save() — nên thêm await để đảm bảo lưu trước khi trả response.
getIdOrder (order.controller): dùng historyOrder.findById nhưng model import ở đầu file là Order — có khả năng lỗi đặt tên biến, nên sửa thành Order.findById.
login: biến password destructure từ response.toObject() bị trùng tên với password lấy từ req.body, và cookie đang set bằng refreshToken (biến chưa gán) thay vì newRefreshToken — cần kiểm tra kỹ vì có thể gây lỗi logic.
Nhiều đoạn code trừ tồn kho khi thêm vào giỏ đang bị comment lại — cân nhắc bật lại hoặc dọn dẹp tuỳ nghiệp vụ mong muốn.
Nghiệp vụ trừ/hoàn tồn kho hiện nằm rải rác ở nhiều nơi (buyNow, paymentDirect, updateStatus) — nên cân nhắc gom vào 1 service dùng chung để tránh lệch logic.