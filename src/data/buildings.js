import { number } from "prop-types";

export const buildings = [
  { id: 1, number: 1, name: "อาคารอำนวยการ 11 ชั้น", className: "building1-1" },
  { id: 2, number: 1, name: "อาคารอำนวยการ 11 ชั้น", className: "building1-2" },
  { id: 3, number: 2, name: "อาคารศูนย์โรคหัวใจ", className: "building2-1" },
  { id: 4, number: 2, name: "อาคารศูนย์โรคหัวใจ", className: "building2-2" },
  { id: 5, number: 3, name: "อาคารออร์โธปิดิกส์", className: "building3" },
  { id: 6, number: 4, name: "อาคารเจ้าพระยายมราช", className: "building4" },
  { id: 7, number: 5, name: "อาคารสนับสนุนทางการแพทย์", className: "building5" },
  { id: 8, number: 6, name: "สำนักงานเทศบาลเมืองสุพรรณบุรี", className: "building6" },
  { id: 9, numver: 7, name: "อาคารจอดรถ 7 ชั้น", className: "building7" },
  { id: 10, number: 8, name: "อนุสาวรีย์ท่านเจ้าคุณ", className: "building8" }
];

export const buildingStyles = {
  "building1-1": "absolute top-[29%] left-[51.4%] w-[23.5%] h-[19%] rounded-tl-[8%] rounded-bl-[8%] opacity-0 hover:opacity-70 hover:shadow-[0_0_20px_rgba(0,119,182,0.6)] transition-all duration-300 cursor-pointer",
  "building1-2": "absolute top-[11.4%] left-[74.8%] w-[11.9%] h-[36.8%] rounded-[10%] rounded-bl-none opacity-0 hover:opacity-70 hover:shadow-[0_0_20px_rgba(0,119,182,0.6)] transition-all duration-300 cursor-pointer",
  "building2-1": "absolute top-[49.4%] left-[51.4%] w-[20.2%] h-[30%] rounded-[6%] rounded-tr-none opacity-0 hover:opacity-70 hover:shadow-[0_0_20px_rgba(239,71,111,0.6)] transition-all duration-300 cursor-pointer",
  "building2-2": "absolute top-[49.4%] left-[71.5%] w-[15.2%] h-[21.4%] rounded-[8%] rounded-tl-none rounded-bl-none opacity-0 hover:opacity-70 hover:shadow-[0_0_20px_rgba(239,71,111,0.6)] transition-all duration-300 cursor-pointer",
  "building3": "absolute top-[11.7%] left-[50.2%] w-[24%] h-[16%] rounded-[9%] opacity-0 hover:opacity-70 hover:shadow-[0_0_20px_rgba(6,214,160,0.6)] transition-all duration-300 cursor-pointer",
  "building4": "absolute top-[29.5%] left-[34%] w-[16.8%] h-[15%] rounded-[10%] opacity-0 hover:opacity-70 hover:shadow-[0_0_20px_rgba(255,209,102,0.6)] transition-all duration-300 cursor-pointer",
  "building5": "absolute top-[28.5%] left-[3%] w-[14.2%] h-[41.5%] rounded-[6%] opacity-0 hover:opacity-70 hover:shadow-[0_0_20px_rgba(17,138,178,0.6)] transition-all duration-300 cursor-pointer",
  "building6": "absolute bottom-[3.6%] right-[3%] w-[6.2%] h-[11.9%] rounded-[20%] opacity-0 hover:opacity-70 hover:shadow-[0_0_20px_rgba(7,59,76,0.6)] transition-all duration-300 cursor-pointer",
  "building7": "absolute bottom-[4%] left-[8.8%] w-[14.2%] h-[10.5%] rounded-[12%] opacity-0 hpver:opacity-70 hover:shadow-[0_0_20px_rgba(7,59,76,0.6)] transittion-all duration-300 cusor-pointer",
  "building8": "absolute bottom-[19%] left-[27%] w-[23%] h-[34%] rounded-[12%] opacity-0 hpver:opacity-70 hover:shadow-[0_0_20px_rgba(7,59,76,0.6)] transittion-all duration-300 cusor-pointer",
}; 