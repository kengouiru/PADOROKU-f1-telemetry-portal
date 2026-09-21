"""
Generate an ultra-authentic F1 pit garage ambient audio track (44.1kHz 16-bit stereo WAV, 30s loop).
CRITICAL FIX: Completely removed all pure sine wave oscillators (520Hz/740Hz whistling drone and 58Hz hum).
Features:
- Pure diffused non-tonal room acoustics (gentle brownian noise air movement, ZERO whistling tones)
- Soft HVAC ventilation airflow (broadband noise, no flute/whistle harmonics)
- Paoli DP6000 pneumatic wheel guns on 4 corners (crisp mechanical impacts + high-pressure nitrogen exhaust hiss)
- Torque wrench double-clicks ("CLICK-CLICK" on wheel spindle nuts)
- Multiple pneumatic air hose snaps & air jack pressure drops ("T-TSHHH")
- Realistic ratchet / wrench metal clinks
- Distant muffled V6 Turbo Hybrid low-end vibration (filtered noise rumble, no sine whistle)
"""

import wave
import struct
import math
import random
import os

SAMPLE_RATE = 44100
DURATION = 30.0  # 30 seconds seamless loop
TOTAL_SAMPLES = int(SAMPLE_RATE * DURATION)

left_channel = [0.0] * TOTAL_SAMPLES
right_channel = [0.0] * TOTAL_SAMPLES

# 1. Pure Diffused Garage Room Acoustics & HVAC Air Movement
# ZERO pure sine waves! Only multi-stage lowpass filtered brownian noise.
# This eliminates any "pooo" / whistling / organ tones completely.
b0_l, b1_l, b2_l = 0.0, 0.0, 0.0
b0_r, b1_r, b2_r = 0.0, 0.0, 0.0

# Air duct broadband rushing noise (gentle bandpass 300Hz-1200Hz, no tonal peaks)
hvac_low_l, hvac_high_l = 0.0, 0.0
hvac_low_r, hvac_high_r = 0.0, 0.0

for i in range(TOTAL_SAMPLES):
    noise_l = random.uniform(-1.0, 1.0)
    noise_r = random.uniform(-1.0, 1.0)
    
    # 3-pole steep lowpass at ~110Hz for warm, deep room acoustics
    b0_l += 0.015 * (noise_l - b0_l)
    b1_l += 0.015 * (b0_l - b1_l)
    b2_l += 0.015 * (b1_l - b2_l)
    
    b0_r += 0.015 * (noise_r - b0_r)
    b1_r += 0.015 * (b0_r - b1_r)
    b2_r += 0.015 * (b1_r - b2_r)
    
    # Gentle broad air duct flow (smooth noise only, no sine frequencies)
    hvac_low_l += 0.06 * (noise_l - hvac_low_l)
    hvac_high_l += 0.18 * (noise_l - hvac_high_l)
    air_l = (hvac_high_l - hvac_low_l) * 0.035
    
    hvac_low_r += 0.06 * (noise_r - hvac_low_r)
    hvac_high_r += 0.18 * (noise_r - hvac_high_r)
    air_r = (hvac_high_r - hvac_low_r) * 0.035
    
    left_channel[i] += (b2_l * 0.32) + air_l
    right_channel[i] += (b2_r * 0.32) + air_r

# Helper: Paoli DP6000 Wheel Gun (Center-lock impact wrench)
# Ultra-crisp mechanical hammer impacts + nitrogen exhaust hiss
def add_wheel_gun(start_time, strikes=10, strike_interval=0.025, pan=0.0, intensity=1.0):
    start_sample = int(start_time * SAMPLE_RATE)
    
    # Initial air trigger rush (30ms noise)
    air_len = int(0.035 * SAMPLE_RATE)
    for j in range(air_len):
        idx = start_sample + j
        if 0 <= idx < TOTAL_SAMPLES:
            noise = random.uniform(-1.0, 1.0) * 0.1 * (1.0 - j / air_len) * intensity
            left_channel[idx] += noise * (1.0 - pan * 0.5)
            right_channel[idx] += noise * (1.0 + pan * 0.5)
            
    # Rapid mechanical hammer strikes
    for s in range(strikes):
        strike_start = start_sample + int((s * strike_interval + 0.025) * SAMPLE_RATE)
        strike_gain = (0.6 + 0.12 * math.sin(s * 0.8)) * intensity
        strike_len = int(0.015 * SAMPLE_RATE)
        
        for j in range(strike_len):
            idx = strike_start + j
            if 0 <= idx < TOTAL_SAMPLES:
                # Ultra-sharp exponential decay (3ms) so NO pitch or ringing lingers
                env = math.exp(-j / (SAMPLE_RATE * 0.0022))
                
                # Transient click + high-pressure mechanical impact burst
                noise = (random.uniform(-1.0, 1.0)) * 0.55
                clunk = math.sin(2 * math.pi * 120.0 * (j / SAMPLE_RATE)) * 0.4
                sample = (noise + clunk) * env * strike_gain
                
                left_channel[idx] += sample * (1.0 - pan * 0.5)
                right_channel[idx] += sample * (1.0 + pan * 0.5)
                
    # High-pressure nitrogen exhaust dump ("TSSSHHH")
    exhaust_start = start_sample + int((strikes * strike_interval + 0.02) * SAMPLE_RATE)
    exhaust_len = int(0.35 * SAMPLE_RATE)
    f_val_l, f_val_r = 0.0, 0.0
    for j in range(exhaust_len):
        idx = exhaust_start + j
        if 0 <= idx < TOTAL_SAMPLES:
            env = math.pow(1.0 - (j / exhaust_len), 1.8)
            noise_l = random.uniform(-1.0, 1.0)
            noise_r = random.uniform(-1.0, 1.0)
            f_val_l += 0.35 * (noise_l - f_val_l)
            f_val_r += 0.35 * (noise_r - f_val_r)
            hiss_l = (noise_l - f_val_l) * env * 0.3 * intensity
            hiss_r = (noise_r - f_val_r) * env * 0.3 * intensity
            left_channel[idx] += hiss_l * (1.0 - pan * 0.4)
            right_channel[idx] += hiss_r * (1.0 + pan * 0.4)

# Helper: High-pressure air hose snap & air jack pressure release ("T-TSCHK")
def add_air_puff(start_time, pan=0.0, intensity=1.0):
    start_sample = int(start_time * SAMPLE_RATE)
    puff_len = int(0.11 * SAMPLE_RATE)
    f_val = 0.0
    for j in range(puff_len):
        idx = start_sample + j
        if 0 <= idx < TOTAL_SAMPLES:
            env = math.exp(-j / (SAMPLE_RATE * 0.016))
            noise = random.uniform(-1.0, 1.0)
            f_val += 0.38 * (noise - f_val)
            hiss = (noise - f_val) * env * 0.35 * intensity
            left_channel[idx] += hiss * (1.0 - pan * 0.5)
            right_channel[idx] += hiss * (1.0 + pan * 0.5)

# Helper: Torque Wrench Double-Click ("CLICK-CLICK" torque verification)
def add_torque_double_click(start_time, pan=0.0, intensity=1.0):
    for offset in [0.0, 0.11]:
        start_sample = int((start_time + offset) * SAMPLE_RATE)
        click_len = int(0.012 * SAMPLE_RATE)
        for j in range(click_len):
            idx = start_sample + j
            if 0 <= idx < TOTAL_SAMPLES:
                env = math.exp(-j / (SAMPLE_RATE * 0.0018))
                noise = random.uniform(-1.0, 1.0) * 0.45 * env * intensity
                left_channel[idx] += noise * (1.0 - pan * 0.5)
                right_channel[idx] += noise * (1.0 + pan * 0.5)

# Helper: Ratchet / Tool Clink
def add_ratchet(start_time, clicks=4, pan=0.0):
    start_sample = int(start_time * SAMPLE_RATE)
    for c in range(clicks):
        c_idx = start_sample + int(c * 0.04 * SAMPLE_RATE)
        c_len = int(0.008 * SAMPLE_RATE)
        for j in range(c_len):
            idx = c_idx + j
            if 0 <= idx < TOTAL_SAMPLES:
                env = 1.0 - j / c_len
                noise = random.uniform(-1.0, 1.0) * env * 0.15
                left_channel[idx] += noise * (1.0 - pan * 0.5)
                right_channel[idx] += noise * (1.0 + pan * 0.5)

# Helper: Distant V6 Hybrid throttle blip (Filtered low-end exhaust thud only, NO sine whistle)
def add_engine_blip(start_time, duration=1.8, pan=0.3):
    start_sample = int(start_time * SAMPLE_RATE)
    total_len = int(duration * SAMPLE_RATE)
    f_engine = 0.0
    for j in range(total_len):
        idx = start_sample + j
        if 0 <= idx < TOTAL_SAMPLES:
            prog = j / total_len
            env = math.sin(math.pi * prog)
            noise = random.uniform(-1.0, 1.0)
            # Lowpass at ~80Hz to simulate muffled exhaust pressure
            f_engine += 0.012 * (noise - f_engine)
            sound = f_engine * env * 0.25
            left_channel[idx] += sound * (1.0 - pan * 0.4)
            right_channel[idx] += sound * (1.0 + pan * 0.4)

# Populate realistic event timeline across 30 seconds
# T = 0.8s: Air hose connect
add_air_puff(0.8, pan=-0.4, intensity=0.9)

# T = 2.4s: Front-Left wheel gun (quick 7 strikes)
add_wheel_gun(2.4, strikes=8, strike_interval=0.024, pan=-0.6, intensity=1.0)

# T = 4.2s: Torque check double-click
add_torque_double_click(4.2, pan=-0.5, intensity=0.95)

# T = 5.8s: Front-Right wheel gun (full 11 strikes)
add_wheel_gun(5.8, strikes=11, strike_interval=0.025, pan=0.6, intensity=1.1)

# T = 7.5s: Ratchet adjustment on front wing
add_ratchet(7.5, clicks=4, pan=0.1)

# T = 9.2s: High-pressure air jack release
add_air_puff(9.2, pan=0.2, intensity=1.0)

# T = 11.5s: Distant V6 Hybrid muffled exhaust rev in pit lane
add_engine_blip(11.5, duration=1.8, pan=0.4)

# T = 14.8s: Rear-Left wheel gun (9 strikes)
add_wheel_gun(14.8, strikes=9, strike_interval=0.026, pan=-0.7, intensity=1.05)

# T = 16.5s: Torque double-click on rear axle
add_torque_double_click(16.5, pan=-0.6, intensity=1.0)

# T = 18.2s: Air line coupling snap
add_air_puff(18.2, pan=-0.3, intensity=0.9)

# T = 20.1s: Rear-Right wheel gun (10 strikes)
add_wheel_gun(20.1, strikes=10, strike_interval=0.025, pan=0.7, intensity=1.1)

# T = 22.4s: Torque check on Rear-Right
add_torque_double_click(22.4, pan=0.6, intensity=0.95)

# T = 24.2s: Ratchet on suspension
add_ratchet(24.2, clicks=3, pan=-0.2)

# T = 26.5s: Final air bleed & quick wheel gun check
add_air_puff(26.5, pan=0.1, intensity=0.95)
add_wheel_gun(27.2, strikes=6, strike_interval=0.023, pan=0.0, intensity=0.85)

# Smooth seamless loop boundary (150ms fade-in/fade-out)
fade_len = int(0.15 * SAMPLE_RATE)
for i in range(fade_len):
    factor = 0.5 * (1.0 - math.cos(math.pi * i / fade_len))
    left_channel[i] *= factor
    right_channel[i] *= factor
    end_idx = TOTAL_SAMPLES - 1 - i
    left_channel[end_idx] *= factor
    right_channel[end_idx] *= factor

# Normalization & Master Limiter
max_val = 0.0001
for i in range(TOTAL_SAMPLES):
    max_val = max(max_val, abs(left_channel[i]), abs(right_channel[i]))

# Target level 0.90 for punchy, clean, non-distorted sound
gain = 0.90 / max_val if max_val > 0 else 1.0

# Write to public/audio/garage_ambient.wav
out_path = os.path.join(os.path.dirname(__file__), "..", "public", "audio", "garage_ambient.wav")
out_path = os.path.abspath(out_path)

with wave.open(out_path, "w") as wav_file:
    wav_file.setnchannels(2)
    wav_file.setsampwidth(2)
    wav_file.setframerate(SAMPLE_RATE)
    
    frames = bytearray()
    for i in range(TOTAL_SAMPLES):
        s_l = math.tanh(left_channel[i] * gain)
        s_r = math.tanh(right_channel[i] * gain)
        val_l = int(s_l * 32767.0)
        val_r = int(s_r * 32767.0)
        frames.extend(struct.pack("<hh", val_l, val_r))
        
    wav_file.writeframes(frames)

print(f"Clean F1 garage ambient WAV generated (NO sine whistle): {out_path} ({len(frames)} bytes, {DURATION}s)")
