export const staticRoutes = [
  {
    name: "synthesis",
    path: "/synthesis",
    component: () => import("@/views/synthesis/index.vue"),
    meta: { title: "首页" },
  },
  {
    name: "chat",
    path: "/chat",
    component: () => import("@/views/chat/index.vue"),
    meta: { title: "聊天室" },
  },
  {
    name: "big-file",
    path: "/big-file",
    component: () => import("@/views/big-file/index.vue"),
    meta: { title: "大文件" },
  },
];

export const privateKey = `-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDrs2HcfcuxS47Q
3V2jw/lQV9Gltv81u+pJaISn2WnXCFbcEWtFbAJb8c73RKlQVnl8N0m75JfJY2+i
frhxfjE11HySzQuOTAAB4uqd/Tmb6Tr9noHa9vxm9zFEonawUI03oAQ/HLkNi9kq
4IVbPn6esg9PEwtdIj+NRDFNaDm4bnKY4wUAaq/Q49HgFsRIovusXvDiUDBT6mDA
baH6yMk6ComyMLnfCsoYIVR0B7TJuO4AH0lGtUtMsTpkox9/tWHmOTdHfci4xAi+
b+UwTYUGcQMhhqYUFWRT3eTurxGg3mtfmgxTm9KFtYUM2+hlLIQRN8xlmRZpTySg
caS6zhMBAgMBAAECggEABZIm1PxQLS+Y/4zL4swF/4Uj2mPZ4l4/ql6DDCiSXNfA
ndD3lRt5bsznVGbWDaUNmAcCgiNkBwmHoPKXz27pINmV3C5mgIWBVooTe4p5qxq3
Hzl43kEKNDDRhErGvWIaBF+O2iMGqLBOgLnvzPlMKtoQjJDpqtjdYaxj8e1tt9Mw
2Vw/Y4ijO6lMadGc6TLLi+XRqxIZXgjRWfKJBspvuM4rlPZRxUKhjtFTnTpvxR2y
piSXD4YTnqQD8c5rfwjfunwc2CLJ/OJQi8Ja1k3XEaUvuWmaJv/hGTnVPkoMSaK9
yehb2OeofBa/Cx4XXrJTejXJP0tOnPH8b4mcSweb8QKBgQD/TqONfHDJqk0hFY6y
ywhMZwZrqWhSzC2ThTRB5vK6SKa839YoiUVgHIGZbFRiwRO64IdtTFGnmK0/CiWz
w2lM/DDHi2tcrN0tp+81yxDYIW4JPwkkZbkp5uyvnn6wfLdKxIXoTfSta+nZNwHz
nCc7dYExA+fsfyDHyhUShIsg9QKBgQDsVx9yQ1ofnVQTRXyLUwOBtSv4RFkAYTMR
2zjiQTVVTp5n/INu3Q8nTkbpDFHQCrdrAqG94Wk8IH3aVFCVTtQi5xWaf3qvh6Mw
rzoEZkgutwZiuxpAoaEg9PgSa+flkrZYMZ0F5lVwLJkTz7bWvdUpcwOL1Um4qh+X
QXKUa35yXQKBgQDHGOhq2fSLEAf+GPWjcLoT+vQC2aXFi/yu4l4SVqxLoYSGHnjA
O+yiOxjGMLjOGovsXFTAY5f5/xJ76snkGivwIWtY8dzT9Oq3RBND/AwywD8zbrkO
bVWs260Qd6WMtHWsFP3oX4LECzfecQtQkyH1OHl7Y/Rlde52X513R23IUQKBgEAP
jXKHVxJirrtahlutcLHjzbtJq2Yy8ojQhyasziwFV2KQS3/tY4If8ZCRyks93GGh
IP467y9hDzvyxrTx3QZo5K4wB600csNre6pdnwsqiQyR8pe6N9abD/LOVNkhX1Og
fxNuT5JMRGHeV4z1f6XwivGIKqdnVZDGKKyaRnfxAoGBAIP9PFfgZa2t/vcEI1Ff
nN93riF1oLpwhWzh7Y+CGd/HwroAcSJvokQNh0y2qcf76N+HZNo1hiwpwBMIyxlN
ZAJE6NisDuEvBQWqk0FnO3BthlK3wW4LwcVkXyamTYtG3OmUKxhwc88tOnLbriEm
AT2LnCJy4SYhfworflRzaGyj
-----END PRIVATE KEY-----

`;

export const publicKey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAo8u6pGXY1+23uVHGdDbz
mO21Dw9bBGUCe+VbxlWmn16P9RJ1N/gY3wMHyq2RqgTK42XaMeh1QQB7qTXjPXCT
KfbZDJxg5ccodSQWONv23cOXr3GtVG5bjcS8KcEuGqcO0JnYJOAPF/8qqbpiS/Ir
bDEhwx9RqEC2UmVFBdBRktS5D21y2ecN/i7z0OvoStsSt0fF9pfZ8R95PrV6uSVb
NNHFSnDcs6e5KxZN7INH6ZHBNv87tcaFLg1pS23ljsIBI1qPFx72D4DmoPvzCXlI
mIrvqLJ8zKDJgSTnUfLkE5FRdDFrjB6wESCg8K4lcQWx6bctk7IUV9CBKHHQ7GOG
VwIDAQAB
-----END PUBLIC KEY-----
`;