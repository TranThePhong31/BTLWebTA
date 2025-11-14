// ===============================
// DỮ LIỆU MOCK CHO ADMIN PANEL
// ===============================

const mockUsers = [
    {
        id: 1,
        name: "Nguyễn Văn A",
        email: "nguyen.van.a@example.com",
        role: "student",
        status: "active",
        avatar: "https://i.pravatar.cc/150?img=1",
        createdAt: "2024-01-15",
        lastActive: "2024-11-14 10:30",
        lessonsCompleted: 45,
        lessonsTotal: 60,
        quizScore: 85,
        courseCompleted: 8,
        hoursSpent: 125,
        activities: [
            { time: "10:30", action: "Hoàn thành bài Học JavaScript cơ bản" },
            { time: "09:15", action: "Tham gia bài kiểm tra" },
            { time: "08:00", action: "Bắt đầu khóa học mới" }
        ]
    },
    {
        id: 2,
        name: "Trần Thị B",
        email: "tran.thi.b@example.com",
        role: "student",
        status: "active",
        avatar: "https://i.pravatar.cc/150?img=2",
        createdAt: "2024-02-20",
        lastActive: "2024-11-14 09:45",
        lessonsCompleted: 52,
        lessonsTotal: 60,
        quizScore: 92,
        courseCompleted: 10,
        hoursSpent: 180,
        activities: [
            { time: "09:45", action: "Xem bài giảng HTML & CSS" },
            { time: "08:30", action: "Tham gia thảo luận nhóm" },
            { time: "07:00", action: "Nộp bài tập" }
        ]
    },
    {
        id: 3,
        name: "Phạm Văn C",
        email: "pham.van.c@example.com",
        role: "teacher",
        status: "active",
        avatar: "https://i.pravatar.cc/150?img=3",
        createdAt: "2023-12-10",
        lastActive: "2024-11-14 11:00",
        lessonsCompleted: 150,
        lessonsTotal: 150,
        quizScore: 95,
        courseCompleted: 20,
        hoursSpent: 500,
        activities: [
            { time: "11:00", action: "Tạo bài kiểm tra mới" },
            { time: "10:00", action: "Chấm điểm bài tập học sinh" },
            { time: "09:00", action: "Cập nhật nội dung khóa học" }
        ]
    },
    {
        id: 4,
        name: "Lê Minh D",
        email: "le.minh.d@example.com",
        role: "student",
        status: "banned",
        avatar: "https://i.pravatar.cc/150?img=4",
        createdAt: "2024-03-05",
        lastActive: "2024-11-10 15:20",
        lessonsCompleted: 10,
        lessonsTotal: 60,
        quizScore: 35,
        courseCompleted: 1,
        hoursSpent: 20,
        activities: [
            { time: "15:20", action: "Thử vi phạm điều lệ" },
            { time: "14:00", action: "Tham gia lớp học" }
        ]
    },
    {
        id: 5,
        name: "Hoàng Thanh E",
        email: "hoang.thanh.e@example.com",
        role: "student",
        status: "inactive",
        avatar: "https://i.pravatar.cc/150?img=5",
        createdAt: "2024-04-12",
        lastActive: "2024-11-01 08:00",
        lessonsCompleted: 15,
        lessonsTotal: 60,
        quizScore: 60,
        courseCompleted: 2,
        hoursSpent: 35,
        activities: [
            { time: "08:00", action: "Xem bài giảng lần cuối" },
            { time: "19:30", action: "Nộp bài tập" }
        ]
    },
    {
        id: 6,
        name: "Đỗ Hữu F",
        email: "do.huu.f@example.com",
        role: "admin",
        status: "active",
        avatar: "https://i.pravatar.cc/150?img=6",
        createdAt: "2023-11-01",
        lastActive: "2024-11-14 12:00",
        lessonsCompleted: 200,
        lessonsTotal: 200,
        quizScore: 100,
        courseCompleted: 30,
        hoursSpent: 800,
        activities: [
            { time: "12:00", action: "Kiểm tra báo cáo hệ thống" },
            { time: "11:00", action: "Khoá tài khoản người dùng" },
            { time: "10:00", action: "Cập nhật chính sách" }
        ]
    },
    {
        id: 7,
        name: "Vũ Thị G",
        email: "vu.thi.g@example.com",
        role: "student",
        status: "active",
        avatar: "https://i.pravatar.cc/150?img=7",
        createdAt: "2024-05-18",
        lastActive: "2024-11-14 13:45",
        lessonsCompleted: 38,
        lessonsTotal: 60,
        quizScore: 78,
        courseCompleted: 6,
        hoursSpent: 95,
        activities: [
            { time: "13:45", action: "Đang xem bài giảng Python" },
            { time: "12:30", action: "Tham gia quiz" },
            { time: "11:00", action: "Xem comment từ giáo viên" }
        ]
    },
    {
        id: 8,
        name: "Bùi Hải H",
        email: "bui.hai.h@example.com",
        role: "student",
        status: "active",
        avatar: "https://i.pravatar.cc/150?img=8",
        createdAt: "2024-06-22",
        lastActive: "2024-11-14 14:15",
        lessonsCompleted: 55,
        lessonsTotal: 60,
        quizScore: 88,
        courseCompleted: 12,
        hoursSpent: 210,
        activities: [
            { time: "14:15", action: "Hoàn thành khóa học Node.js" },
            { time: "13:00", action: "Nộp dự án cuối kỳ" },
            { time: "11:30", action: "Tham gia buổi tư vấn" }
        ]
    }
];

const mockAnalytics = {
    totalUsers: mockUsers.length,
    activeUsers: mockUsers.filter(u => u.status === "active").length,
    totalLessonsCompleted: mockUsers.reduce((sum, u) => sum + u.lessonsCompleted, 0),
    averageHoursSpent: (mockUsers.reduce((sum, u) => sum + u.hoursSpent, 0) / mockUsers.length).toFixed(1),
    averageCompletionRate: (mockUsers.reduce((sum, u) => sum + (u.lessonsCompleted / u.lessonsTotal * 100), 0) / mockUsers.length).toFixed(1),
    
    // Dữ liệu theo ngày
    newUsersByDay: [
        { day: "Mon", count: 5 },
        { day: "Tue", count: 8 },
        { day: "Wed", count: 6 },
        { day: "Thu", count: 9 },
        { day: "Fri", count: 12 },
        { day: "Sat", count: 7 },
        { day: "Sun", count: 4 }
    ],
    
    // Tỷ lệ hoàn thành theo ngày
    completionRateByDay: [
        { day: "Mon", rate: 65 },
        { day: "Tue", rate: 72 },
        { day: "Wed", rate: 68 },
        { day: "Thu", rate: 75 },
        { day: "Fri", rate: 78 },
        { day: "Sat", rate: 70 },
        { day: "Sun", rate: 62 }
    ],
    
    // Phân bố trạng thái
    statusDistribution: [
        { status: "Active", count: mockUsers.filter(u => u.status === "active").length },
        { status: "Inactive", count: mockUsers.filter(u => u.status === "inactive").length },
        { status: "Banned", count: mockUsers.filter(u => u.status === "banned").length }
    ],
    
    // Khóa học phổ biến
    popularCourses: [
        { name: "JavaScript", students: 34, hours: 450 },
        { name: "React", students: 28, hours: 380 },
        { name: "Node.js", students: 25, hours: 340 },
        { name: "Python", students: 22, hours: 300 },
        { name: "HTML & CSS", students: 35, hours: 500 }
    ],
    
    // Thống kê theo vai trò
    statsByRole: [
        {
            role: "Student",
            count: mockUsers.filter(u => u.role === "student").length,
            avgLessons: 35,
            avgHours: 120,
            completionRate: 70
        },
        {
            role: "Teacher",
            count: mockUsers.filter(u => u.role === "teacher").length,
            avgLessons: 150,
            avgHours: 500,
            completionRate: 95
        },
        {
            role: "Admin",
            count: mockUsers.filter(u => u.role === "admin").length,
            avgLessons: 200,
            avgHours: 800,
            completionRate: 100
        }
    ]
};

const mockChatUsers = [
    { id: 1, name: "Nguyễn Văn A", avatar: "https://i.pravatar.cc/150?img=1", isOnline: true },
    { id: 2, name: "Trần Thị B", avatar: "https://i.pravatar.cc/150?img=2", isOnline: true },
    { id: 3, name: "Phạm Văn C", avatar: "https://i.pravatar.cc/150?img=3", isOnline: false },
    { id: 4, name: "Lê Minh D", avatar: "https://i.pravatar.cc/150?img=4", isOnline: true },
    { id: 5, name: "Hoàng Thanh E", avatar: "https://i.pravatar.cc/150?img=5", isOnline: false },
];

const mockMessages = {
    1: [
        { id: 1, from: "admin", text: "Xin chào Nguyễn Văn A, bạn khỏe không?", time: "10:00" },
        { id: 2, from: "user", text: "Xin chào admin! Tôi khỏe, cảm ơn bạn", time: "10:05" },
        { id: 3, from: "admin", text: "Bạn đã hoàn thành bài tập chưa?", time: "10:10" },
        { id: 4, from: "user", text: "Rồi, tôi vừa nộp xong", time: "10:12" }
    ],
    2: [
        { id: 1, from: "admin", text: "Trần Thị B, chúc mừng bạn đạt 92 điểm!", time: "09:00" },
        { id: 2, from: "user", text: "Cảm ơn admin, tôi rất vui!", time: "09:05" }
    ],
    3: [],
    4: [
        { id: 1, from: "admin", text: "Lê Minh D, bạn có vấn đề gì không?", time: "08:00" }
    ],
    5: [
        { id: 1, from: "admin", text: "Hoàng Thanh, bạn đã lâu không học rồi", time: "07:00" }
    ]
};

// Hàm helper để định dạng ngày
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", { year: "numeric", month: "long", day: "numeric" });
}

// Hàm helper để định dạng giờ
function formatTime(timeString) {
    return new Date(`2024-01-01 ${timeString}`).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
}

// Export cho sử dụng trong các module khác
if (typeof module !== "undefined" && module.exports) {
    module.exports = { mockUsers, mockAnalytics, mockChatUsers, mockMessages, formatDate, formatTime };
}