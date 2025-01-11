def save_base64_as_txt(base64_string: str, output_filename: str):
    # 直接将 Base64 字符串写入文本文件
    with open(output_filename, 'w') as txt_file:
        txt_file.write(base64_string)
    print(f"Base64编码已保存为 {output_filename}")

import base64
image_path = "/Users/yuchen/Downloads/channels4_profile.jpg"

# 读取图片并转为Base64编码
with open(image_path, "rb") as image_file:
    encoded_string = base64.b64encode(image_file.read()).decode()


# 保存为 .txt 文件
save_base64_as_txt(encoded_string, "output_base64.txt")
