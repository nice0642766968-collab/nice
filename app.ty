import streamlit as st
import pandas as pd
from datetime import datetime

# 1. ตั้งค่าหน้าเว็บ (Page Config)
st.set_page_config(
    page_title="Lost & Found Hub",
    page_icon="🟢",
    layout="centered"
)

# 2. ปรับแต่งธีมสีเขียว-เหลือง ด้วย CSS (Custom CSS)
st.markdown("""
    <style>
    /* เปลี่ยนสีพื้นหลังหลัก */
    .stApp {
        background-color: #F1F8E9; /* เขียวอ่อนพาสเทล */
    }
    
    /* หัวข้อหลัก (H1) */
    h1 {
        color: #2E7D32; /* เขียวเข้ม */
        text-align: center;
        border-bottom: 3px solid #FFEA00; /* ขีดเส้นใต้สีเหลือง */
        padding-bottom: 10px;
    }
    
    /* หัวข้อรอง (H2, H3) */
    h2, h3 {
        color: #558B2F;
    }

    /* ปรับแต่งปุ่มกด (Button) */
    div.stButton > button {
        background-color: #FBC02D; /* เหลืองเข้ม */
        color: #1B5E20; /* ตัวอักษรเขียวแก่ */
        border-radius: 20px;
        font-weight: bold;
        border: 2px solid #F9A825;
        width: 100%;
    }
    div.stButton > button:hover {
        background-color: #FFEA00; /* เหลืองสดเมื่อเอาเมาส์ชี้ */
        color: black;
        border-color: #FBC02D;
    }

    /* ปรับแต่งการ์ดแสดงผล */
    .data-card {
        background-color: white;
        padding: 15px;
        border-radius: 10px;
        border-left: 10px solid #2E7D32;
        box-shadow: 2px 2px 5px rgba(0,0,0,0.1);
        margin-bottom: 10px;
    }
    .lost-tag { color: #D32F2F; font-weight: bold; }
    .found-tag { color: #2E7D32; font-weight: bold; }
    </style>
    """, unsafe_allow_html=True)

# 3. เตรียมตัวแปรสำหรับเก็บข้อมูล (Session State)
# หมายเหตุ: ข้อมูลจะหายไปเมื่อ Restart App (สำหรับการใช้งานจริงควรต่อกับ Database หรือ Google Sheets)
if 'data' not in st.session_state:
    st.session_state.data = []

# --- ส่วนหัวของเว็บ ---
st.title("🟢 Lost & Found Hub 🟡")
st.markdown("<h3 style='text-align: center;'>ศูนย์รวมแจ้งของหาย - เก็บได้</h3>", unsafe_allow_html=True)

# --- สร้าง Tabs เปลี่ยนหน้า ---
tab1, tab2 = st.tabs(["📝 แจ้งข้อมูล (Report)", "📋 รายการทั้งหมด (List)"])

# --- Tab 1: ฟอร์มแจ้งข้อมูล ---
with tab1:
    st.header("กรอกข้อมูลของหาย/เก็บได้")
    
    with st.form("report_form", clear_on_submit=True):
        col1, col2 = st.columns(2)
        with col1:
            report_type = st.selectbox("ประเภท (Type)", ["ของหาย (Lost)", "เก็บได้ (Found)"])
        with col2:
            item_name = st.text_input("ชื่อสิ่งของ (Item Name)", placeholder="เช่น กุญแจรถ, กระเป๋าตังค์")
            
        location = st.text_input("สถานที่ (Location)", placeholder="เช่น โรงอาหาร, หน้าตึก 3")
        description = st.text_area("รายละเอียดเพิ่มเติม (Description)", placeholder="สี, จุดสังเกต, เบอร์ติดต่อกลับ")
        
        submitted = st.form_submit_button("บันทึกข้อมูล")
        
        if submitted:
            if item_name and location:
                # บันทึกข้อมูลลงใน Session State
                new_entry = {
                    "Type": report_type,
                    "Item": item_name,
                    "Location": location,
                    "Description": description,
                    "Time": datetime.now().strftime("%Y-%m-%d %H:%M")
                }
                st.session_state.data.insert(0, new_entry) # เพิ่มข้อมูลใหม่ไว้บนสุด
                st.success(f"บันทึกข้อมูล '{item_name}' เรียบร้อยแล้ว!")
            else:
                st.error("กรุณากรอกชื่อสิ่งของและสถานที่")

# --- Tab 2: แสดงรายการ ---
with tab2:
    st.header("รายการแจ้งล่าสุด")
    
    if len(st.session_state.data) > 0:
        # แปลงข้อมูลเป็น DataFrame เพื่อการจัดการง่ายๆ (ถ้าต้องการ)
        # แต่เราจะวนลูปแสดงเป็น Card สวยๆ แทน
        
        for index, item in enumerate(st.session_state.data):
            # กำหนดสีขอบซ้ายตามประเภท
            border_color = "#D32F2F" if "Lost" in item['Type'] else "#2E7D32"
            tag_class = "lost-tag" if "Lost" in item['Type'] else "found-tag"
            icon = "❓" if "Lost" in item['Type'] else "✅"
            
            st.markdown(f"""
            <div class="data-card" style="border-left: 10px solid {border_color};">
                <div style="display: flex; justify-content: space-between;">
                    <h4 style="margin:0;">{icon} {item['Item']}</h4>
                    <span class="{tag_class}">{item['Type']}</span>
                </div>
                <p style="margin: 5px 0; color: #666;">📍 <b>สถานที่:</b> {item['Location']}</p>
                <p style="font-size: 0.9em;">📝 {item['Description']}</p>
                <small style="color: #999;">🕒 {item['Time']}</small>
            </div>
            """, unsafe_allow_html=True)
            
            # ปุ่มลบข้อมูล (สำหรับ Demo)
            if st.button(f"ลบรายการนี้", key=f"del_{index}"):
                st.session_state.data.pop(index)
                st.rerun()
    else:
        st.info("ยังไม่มีข้อมูลแจ้งเข้ามา")

# --- Footer ---
st.markdown("---")
st.markdown("<p style='text-align: center; color: #2E7D32;'>พัฒนาด้วย Python & Streamlit (Theme: Green-Yellow)</p>", unsafe_allow_html=True)
