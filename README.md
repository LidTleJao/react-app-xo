# WebSite Tic Tac Toe Game by React TypeScript

## Overview
เป็นเว็บไซต์ React TypeScript สำหรับเล่น xo หรือ Tic-Tac-Toe Game เว็บไซต์จะมี Mode ในการเล่นอยู่ 2 Mode คือ Mode Player vs Player กับ Mode Player vs Ai และผู้เล่นสามารถปรับขนาดของตารางได้ตามที่ต้องการ ระบบยังสามารถบันทึกผลการเล่นในแต่ละเกมได้ โดยจะเก็บข้อมูลไว้ใน Firestore Database

# Getting Started

## Prerequisites
- ระบบอาจจะช้าบ้างเป็นบางที จึงไม่สามารถกดเร็วได้ แต่ถ้ามีอาการให้ทำการกดปุ่ม Refresh tap ได้ ระบบก็จะมากลับเป็นปกติ
- การสร้างขนาดตาราง ถ้าหากขนาดตารางที่มากเกินไป อาจจะทำให้ตารางของเกมดูยากมากขึ้น จะทำให้การเล่นยากขึ้นเป็นอย่างมาก จึงไม่แนะนำทำให้ตารางมีขนาดที่มากเกินไป เพื่อความสนุกในการเล่น

## Setup

### 1. Clone Project

git clone https://github.com/LidTleJao/react-app-xo.git
cd react-app-xo

### 2. Install MUI

npm install @mui/material @emotion/react @emotion/styled
npm install @mui/icons-material
npm install @mui/system

### 3. Install Tailwind

npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

### 4. เข้าไปที่ไฟล์ tailwind.config.js แก้ในส่วนของ content

/** @type {import('tailwindcss').Config} */ 
export default {
	content: [ 
		"./index.html", 
		"./src/**/*.{js,ts,jsx,tsx}", 
	], 
	theme: { 
		extend: {}, 
	}, 
	plugins: [], 
}

### 5. แล้วเข้าไปที่ไฟล์ ./src/index.css แล้วเพิ่ม

@tailwind base; 
@tailwind components; 
@tailwind utilities;

### 6. Install Firebase

npm install firebase
npm install -g firebase-tools

### 7. Test Run Program

npm run dev

## Feature

- Game Mode
  - Mode Player vs Player: ผู้เล่นจะเล่นกับผู้เล่นคนอื่นในจอเดียวกัน
  - Mode Player vs Ai: ผู้เล่นจะเล่นกับ Ai ที่ถูกสร้างขึ้นมา เพื่อเหมาะสำหรับการเล่นคนเดียว ถ้าผู้เล่นเล่นกระดานขนาดอยู่ที่ 3x3 Ai จะใช้สูตรอัลกอริทึมคือ Minimax Algorithm แต่ถ้าหากผู้เล่นเล่นกระดานขนาดอยู่ที่ 4x4 (ขึ้นไป) Ai จะสลับใช้วิธีในการสุ่มตำแหน่งที่ยังว่างแทน เพื่อความหลากหลายและรองรับขนาดของตารางที่มีมากขึ้นตามไปด้วย

- Custom Size Game
  - เลือกขนาดกระดานที่กำหนดไว้: 3x3, 4x4, 5x5, และ 6x6
  - กำหนดขนาดกระดานเอง(กรอกได้แค่ตัวเลขที่เป็นบวกเท่านั้น)
  - !!!คำเตือน!!! การสร้างขนาดตาราง ถ้าหากขนาดตารางที่มากเกินไป จะทำให้เกมเล่นยากขึ้นและดูยากขึ้น
  - !!!คำเตือน!!! การกำหนดขนาดกระดานเอง ไม่แนะนำให้กรอกตัวเลขที่มีน้อยกว่า 3 เนื่องจากระบบจะไม่ให้กรอกได้ ถ้าหากต้องการอยากให้ตารางที่มีมากกว่า 6x6 (ขึ้นไป) แนะนำให้ได้ใช้ การเลือกขนาดกระดานที่กำหนดไว้ ก่อนแล้วเติมเลข 1 หรือ 2 ข้างหน้า ตัวเลขที่กำหนดไว้ให้ครับ

- Reset Board
  - สามารถกด Reset Board ในแต่ละเกมได้และจะไม่ยกเลิกขนาดของตารางที่ผู้เล่นเลือกไว้ได้ สามารถเล่นขนาดของตารางที่ผู้เล่นเลือกไว้ได้ตามปกติครับ

- History Game
  - สามารถดูประวัติย้อนหลังของ Mode Player vs Player ได้โดยการกดปุ่ม icon History ด้านบนซ้ายและสามารถดูผลการแข่งขันในแต่ละเกมได้
  - สามารถดูประวัติย้อนหลังของ Mode Player vs Ai ได้โดยการกดปุ่ม icon History ด้านบนซ้ายและสามารถดูผลการแข่งขันในแต่ละเกมได้