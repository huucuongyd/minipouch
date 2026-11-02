"use server";

import { sendContactEmail } from "@/lib/email";

export type ContactState = {
  status: "idle" | "success" | "error";
  message: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function readString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function submitContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const honeypot = readString(formData, "website");
  if (honeypot) {
    return {
      status: "success",
      message: "Cảm ơn bạn, chúng mình đã nhận được lời nhắn.",
    };
  }

  const name = readString(formData, "name");
  const email = readString(formData, "email");
  const phone = readString(formData, "phone");
  const product = readString(formData, "product");
  const message = readString(formData, "message");

  if (name.length < 2) {
    return { status: "error", message: "Bạn cho chúng mình biết tên nhé." };
  }
  if (!emailPattern.test(email)) {
    return { status: "error", message: "Email chưa đúng định dạng." };
  }
  if (message.length < 8) {
    return {
      status: "error",
      message: "Hãy viết thêm vài dòng để chúng mình hỗ trợ bạn tốt hơn.",
    };
  }
  if (message.length > 2000) {
    return { status: "error", message: "Lời nhắn hơi dài, hãy rút gọn dưới 2000 ký tự." };
  }

  try {
    const result = await sendContactEmail({
      name,
      email,
      phone,
      product,
      message,
    });

    if (!result.sent) {
      return {
        status: "success",
        message:
          "Cảm ơn bạn. Chúng mình đã nhận lời nhắn và sẽ phản hồi sớm.",
      };
    }

    return {
      status: "success",
      message: "Cảm ơn bạn. Chúng mình sẽ phản hồi qua email trong thời gian sớm nhất.",
    };
  } catch (error) {
    console.error("[NuBeNa] Gửi mail thất bại:", error);
    return {
      status: "error",
      message: "Gửi chưa thành công. Bạn thử lại hoặc nhắn trực tiếp qua Instagram nhé.",
    };
  }
}
