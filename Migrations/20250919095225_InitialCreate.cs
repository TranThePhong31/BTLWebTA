using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Project1.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "BaiHoc",
                columns: table => new
                {
                    ma_bai = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    tieu_de = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    mo_ta = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    loai_noi_dung = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    duong_dan = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__BaiHoc__03FFDF7033CBE4A7", x => x.ma_bai);
                });

            migrationBuilder.CreateTable(
                name: "DeThiMau",
                columns: table => new
                {
                    ma_de = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    tieu_de = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    mo_ta = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    loai = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__DeThiMau__0FE14F02BD6445BE", x => x.ma_de);
                });

            migrationBuilder.CreateTable(
                name: "DoanVan",
                columns: table => new
                {
                    ma_doan = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    tieu_de = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    noi_dung = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    tom_tat = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    tu_khoa = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__DoanVan__99090DA573447039", x => x.ma_doan);
                });

            migrationBuilder.CreateTable(
                name: "NguoiDung",
                columns: table => new
                {
                    ma_nguoi_dung = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ten_dang_nhap = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    email = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    mat_khau = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ngon_ngu_ua_thich = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: true),
                    ngay_tao = table.Column<DateTime>(type: "datetime2", nullable: true, defaultValueSql: "(sysdatetime())")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__NguoiDun__19C32CF7874D3E46", x => x.ma_nguoi_dung);
                });

            migrationBuilder.CreateTable(
                name: "TuVung",
                columns: table => new
                {
                    ma_tu = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    tu = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    phien_am = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    nghia = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    tu_loai = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    vi_du = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    duong_dan_anh = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    trinh_do = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__TuVung__0FE0CD2E9C437D01", x => x.ma_tu);
                });

            migrationBuilder.CreateTable(
                name: "CauHoi",
                columns: table => new
                {
                    ma_cau = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ma_doan = table.Column<int>(type: "int", nullable: true),
                    noi_dung = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__CauHoi__043FED5DF5C14A3D", x => x.ma_cau);
                    table.ForeignKey(
                        name: "FK__CauHoi__ma_doan__5070F446",
                        column: x => x.ma_doan,
                        principalTable: "DoanVan",
                        principalColumn: "ma_doan",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "GhiAm",
                columns: table => new
                {
                    ma = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ma_nguoi_dung = table.Column<int>(type: "int", nullable: true),
                    lien_ket_id = table.Column<int>(type: "int", nullable: true),
                    loai_lien_ket = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    duong_dan_audio = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    van_ban = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    diem = table.Column<double>(type: "float", nullable: true),
                    nhan_xet = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ngay_tao = table.Column<DateTime>(type: "datetime2", nullable: true, defaultValueSql: "(sysdatetime())")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__GhiAm__3213C8B760ACF60F", x => x.ma);
                    table.ForeignKey(
                        name: "FK__GhiAm__ma_nguoi___628FA481",
                        column: x => x.ma_nguoi_dung,
                        principalTable: "NguoiDung",
                        principalColumn: "ma_nguoi_dung",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "KetBan",
                columns: table => new
                {
                    ma = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ma_nguoi_1 = table.Column<int>(type: "int", nullable: true),
                    ma_nguoi_2 = table.Column<int>(type: "int", nullable: true),
                    trang_thai = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true, defaultValue: "cho"),
                    ngay_tao = table.Column<DateTime>(type: "datetime2", nullable: true, defaultValueSql: "(sysdatetime())")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__KetBan__3213C8B768656821", x => x.ma);
                    table.ForeignKey(
                        name: "FK__KetBan__ma_nguoi__6754599E",
                        column: x => x.ma_nguoi_1,
                        principalTable: "NguoiDung",
                        principalColumn: "ma_nguoi_dung");
                    table.ForeignKey(
                        name: "FK__KetBan__ma_nguoi__68487DD7",
                        column: x => x.ma_nguoi_2,
                        principalTable: "NguoiDung",
                        principalColumn: "ma_nguoi_dung");
                });

            migrationBuilder.CreateTable(
                name: "KetQuaBaiThi",
                columns: table => new
                {
                    ma = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ma_nguoi_dung = table.Column<int>(type: "int", nullable: true),
                    ma_de = table.Column<int>(type: "int", nullable: true),
                    diem = table.Column<double>(type: "float", nullable: true),
                    chi_tiet = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ngay_tao = table.Column<DateTime>(type: "datetime2", nullable: true, defaultValueSql: "(sysdatetime())")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__KetQuaBa__3213C8B7B1A6B463", x => x.ma);
                    table.ForeignKey(
                        name: "FK__KetQuaBai__ma_de__5DCAEF64",
                        column: x => x.ma_de,
                        principalTable: "DeThiMau",
                        principalColumn: "ma_de");
                    table.ForeignKey(
                        name: "FK__KetQuaBai__ma_ng__5CD6CB2B",
                        column: x => x.ma_nguoi_dung,
                        principalTable: "NguoiDung",
                        principalColumn: "ma_nguoi_dung",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "NguoiDung_BaiHoc",
                columns: table => new
                {
                    ma = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ma_nguoi_dung = table.Column<int>(type: "int", nullable: true),
                    ma_bai = table.Column<int>(type: "int", nullable: true),
                    trang_thai = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true, defaultValue: "chua_bat_dau"),
                    diem = table.Column<double>(type: "float", nullable: true),
                    ngay_hoan_thanh = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__NguoiDun__3213C8B7579B0F96", x => x.ma);
                    table.ForeignKey(
                        name: "FK__NguoiDung__ma_ba__48CFD27E",
                        column: x => x.ma_bai,
                        principalTable: "BaiHoc",
                        principalColumn: "ma_bai",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK__NguoiDung__ma_ng__47DBAE45",
                        column: x => x.ma_nguoi_dung,
                        principalTable: "NguoiDung",
                        principalColumn: "ma_nguoi_dung",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "NhatKyHoatDong",
                columns: table => new
                {
                    ma = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ma_nguoi_dung = table.Column<int>(type: "int", nullable: true),
                    hanh_dong = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    du_lieu = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ngay_tao = table.Column<DateTime>(type: "datetime2", nullable: true, defaultValueSql: "(sysdatetime())")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__NhatKyHo__3213C8B768518CCB", x => x.ma);
                    table.ForeignKey(
                        name: "FK__NhatKyHoa__ma_ng__6E01572D",
                        column: x => x.ma_nguoi_dung,
                        principalTable: "NguoiDung",
                        principalColumn: "ma_nguoi_dung",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "NguoiDung_TuVung",
                columns: table => new
                {
                    ma = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ma_nguoi_dung = table.Column<int>(type: "int", nullable: true),
                    ma_tu = table.Column<int>(type: "int", nullable: true),
                    he_so_de = table.Column<double>(type: "float", nullable: true, defaultValue: 2.5),
                    ngay_on_tap_cuoi = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ngay_on_tap_tiep = table.Column<DateTime>(type: "datetime2", nullable: true),
                    da_thanh_thao = table.Column<bool>(type: "bit", nullable: true, defaultValue: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__NguoiDun__3213C8B73A313E59", x => x.ma);
                    table.ForeignKey(
                        name: "FK__NguoiDung__ma_ng__3F466844",
                        column: x => x.ma_nguoi_dung,
                        principalTable: "NguoiDung",
                        principalColumn: "ma_nguoi_dung",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK__NguoiDung__ma_tu__403A8C7D",
                        column: x => x.ma_tu,
                        principalTable: "TuVung",
                        principalColumn: "ma_tu",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DeThiMau_CauHoi",
                columns: table => new
                {
                    ma_de = table.Column<int>(type: "int", nullable: false),
                    ma_cau = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__DeThiMau__CFA2B1D7E2DB2083", x => new { x.ma_de, x.ma_cau });
                    table.ForeignKey(
                        name: "FK__DeThiMau___ma_ca__59FA5E80",
                        column: x => x.ma_cau,
                        principalTable: "CauHoi",
                        principalColumn: "ma_cau",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK__DeThiMau___ma_de__59063A47",
                        column: x => x.ma_de,
                        principalTable: "DeThiMau",
                        principalColumn: "ma_de",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "LuaChon",
                columns: table => new
                {
                    ma = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ma_cau = table.Column<int>(type: "int", nullable: true),
                    noi_dung = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    la_dap_an = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__LuaChon__3213C8B701CE516C", x => x.ma);
                    table.ForeignKey(
                        name: "FK__LuaChon__ma_cau__534D60F1",
                        column: x => x.ma_cau,
                        principalTable: "CauHoi",
                        principalColumn: "ma_cau",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CauHoi_ma_doan",
                table: "CauHoi",
                column: "ma_doan");

            migrationBuilder.CreateIndex(
                name: "IX_DeThiMau_CauHoi_ma_cau",
                table: "DeThiMau_CauHoi",
                column: "ma_cau");

            migrationBuilder.CreateIndex(
                name: "IX_GhiAm_ma_nguoi_dung",
                table: "GhiAm",
                column: "ma_nguoi_dung");

            migrationBuilder.CreateIndex(
                name: "IX_KetBan_ma_nguoi_2",
                table: "KetBan",
                column: "ma_nguoi_2");

            migrationBuilder.CreateIndex(
                name: "UQ_KetBan",
                table: "KetBan",
                columns: new[] { "ma_nguoi_1", "ma_nguoi_2" },
                unique: true,
                filter: "[ma_nguoi_1] IS NOT NULL AND [ma_nguoi_2] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_KetQuaBaiThi_ma_de",
                table: "KetQuaBaiThi",
                column: "ma_de");

            migrationBuilder.CreateIndex(
                name: "IX_KetQuaBaiThi_ma_nguoi_dung",
                table: "KetQuaBaiThi",
                column: "ma_nguoi_dung");

            migrationBuilder.CreateIndex(
                name: "IX_LuaChon_ma_cau",
                table: "LuaChon",
                column: "ma_cau");

            migrationBuilder.CreateIndex(
                name: "UQ__NguoiDun__363698B33605E88F",
                table: "NguoiDung",
                column: "ten_dang_nhap",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "UQ__NguoiDun__AB6E616459BB182D",
                table: "NguoiDung",
                column: "email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_NguoiDung_BaiHoc_ma_bai",
                table: "NguoiDung_BaiHoc",
                column: "ma_bai");

            migrationBuilder.CreateIndex(
                name: "UQ_NguoiDung_BaiHoc",
                table: "NguoiDung_BaiHoc",
                columns: new[] { "ma_nguoi_dung", "ma_bai" },
                unique: true,
                filter: "[ma_nguoi_dung] IS NOT NULL AND [ma_bai] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_NguoiDung_TuVung_ma_tu",
                table: "NguoiDung_TuVung",
                column: "ma_tu");

            migrationBuilder.CreateIndex(
                name: "UQ_NguoiDung_TuVung",
                table: "NguoiDung_TuVung",
                columns: new[] { "ma_nguoi_dung", "ma_tu" },
                unique: true,
                filter: "[ma_nguoi_dung] IS NOT NULL AND [ma_tu] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_NhatKyHoatDong_ma_nguoi_dung",
                table: "NhatKyHoatDong",
                column: "ma_nguoi_dung");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DeThiMau_CauHoi");

            migrationBuilder.DropTable(
                name: "GhiAm");

            migrationBuilder.DropTable(
                name: "KetBan");

            migrationBuilder.DropTable(
                name: "KetQuaBaiThi");

            migrationBuilder.DropTable(
                name: "LuaChon");

            migrationBuilder.DropTable(
                name: "NguoiDung_BaiHoc");

            migrationBuilder.DropTable(
                name: "NguoiDung_TuVung");

            migrationBuilder.DropTable(
                name: "NhatKyHoatDong");

            migrationBuilder.DropTable(
                name: "DeThiMau");

            migrationBuilder.DropTable(
                name: "CauHoi");

            migrationBuilder.DropTable(
                name: "BaiHoc");

            migrationBuilder.DropTable(
                name: "TuVung");

            migrationBuilder.DropTable(
                name: "NguoiDung");

            migrationBuilder.DropTable(
                name: "DoanVan");
        }
    }
}
