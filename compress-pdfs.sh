#!/bin/bash

# ==========================================
# PDF 压缩脚本 - 为中国用户优化加载速度
# ==========================================
# 用法: bash compress-pdfs.sh
# 前置条件: 需要安装 Ghostscript (gs)
# Mac: brew install ghostscript
# Ubuntu: sudo apt-get install ghostscript
# CentOS: sudo yum install ghostscript
# ==========================================

set -e

PDF_DIR="assets/pdf"
BACKUP_DIR="assets/pdf-backup"
COMPRESSION_LEVEL="/ebook"  # 可选: /screen(最小, 适合屏幕), /ebook(平衡), /prepress(高质量)

echo "🔧 PDF 压缩工具 - 开始处理..."
echo ""

# 检查Ghostscript是否安装
if ! command -v gs &> /dev/null; then
    echo "❌ 错误: 未检测到 Ghostscript"
    echo "请先安装:"
    echo "  macOS:   brew install ghostscript"
    echo "  Ubuntu:  sudo apt-get install ghostscript"
    echo "  CentOS:  sudo yum install ghostscript"
    exit 1
fi

# 创建备份目录
if [ ! -d "$BACKUP_DIR" ]; then
    mkdir -p "$BACKUP_DIR"
    echo "📁 已创建备份目录: $BACKUP_DIR"
fi

# 处理每个PDF文件
total_saved=0

for pdf_file in "$PDF_DIR"/*.pdf; do
    if [ -f "$pdf_file" ]; then
        filename=$(basename "$pdf_file")
        original_size=$(stat -f%z "$pdf_file" 2>/dev/null || stat -c%s "$pdf_file" 2>/dev/null)
        
        echo "处理: $filename"
        
        # 备份原文件
        cp "$pdf_file" "$BACKUP_DIR/$filename.bak"
        
        # 使用Ghostscript压缩
        gs -sDEVICE=pdfwrite \
           -dCompatibilityLevel=1.4 \
           -dPDFSETTINGS=$COMPRESSION_LEVEL \
           -dNOPAUSE \
           -dQUIET \
           -dBATCH \
           -sOutputFile="$pdf_file.tmp" \
           "$pdf_file"
        
        # 替换原文件
        if [ -f "$pdf_file.tmp" ]; then
            mv "$pdf_file.tmp" "$pdf_file"
            
            # 计算压缩率
            new_size=$(stat -f%z "$pdf_file" 2>/dev/null || stat -c%s "$pdf_file" 2>/dev/null)
            saved=$((original_size - new_size))
            saved_percent=$((saved * 100 / original_size))
            
            echo "  ✅ 成功: ${original_size}B → ${new_size}B (节省 ${saved_percent}%)"
            total_saved=$((total_saved + saved))
        else
            echo "  ❌ 失败: 压缩过程错误，已恢复原文件"
            cp "$BACKUP_DIR/$filename.bak" "$pdf_file"
        fi
        
        echo ""
    fi
done

# 显示总结
echo "========================================"
echo "✨ 压缩完成"
echo "========================================"
echo "📊 总计节省大小: ${total_saved}B ($(( total_saved / 1024 ))KB)"
echo "💾 备份已保存到: $BACKUP_DIR"
echo ""
echo "💡 建议:"
echo "   1. 测试PDF在浏览器中的显示效果"
echo "   2. 如有问题，可从备份目录恢复: cp $BACKUP_DIR/*.bak $PDF_DIR/ && rm $PDF_DIR/*.bak"
echo "   3. 压缩完成后，提交到Git: git add assets/pdf && git commit -m 'chore: optimize pdf files'"
echo ""
