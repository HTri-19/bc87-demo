LINK PHÂN CHIA CÔNG VIỆC - NOTION
https://www.notion.so/TASKS-25d66961b44080f7a3cff6b6c7882768?source=copy_link

# 🚀 Quy trình làm việc với Git

## 📌 Trước khi bắt đầu code
Chỉ pull khi đã làm xong tính năng ở branch của mình.  
Nếu chưa làm xong thì không cần, cứ tiếp tục làm.

```bash
git pull origin main
```

---

## 🌿 Tạo branch mới
```bash
git checkout -b <ten-branch>
```
**Ví dụ:**
```bash
git checkout -b header
```

---

## 💻 Trong quá trình code
Dù chưa xong vẫn phải commit thường xuyên để tránh mất dữ liệu.

```bash
git add .
git commit -m "Thông tin rõ ràng về nội dung commit"
```

❌ **Tránh commit như:**
```bash
asd
123123
aaa
```

✅ **Ví dụ commit rõ ràng:**
```bash
"add Header UI"
"fix responsive issue for mobile"
"update login validation"
```

---

## 📤 Push code lên Git
```bash
git push origin <ten-branch>
```
**Ví dụ:**
```bash
git push origin header
```

---

## 🔁 Kiểm tra & chuyển branch
**Kiểm tra đang ở branch nào:**
```bash
git branch
```
**Chuyển sang branch khác:**
```bash
git checkout <ten-branch>
```

