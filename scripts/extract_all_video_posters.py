import os, subprocess, glob

videos = [
    ("public/products-assets/windows/video_2026-09-26_07-36-00 (10).mp4", "public/products-assets/windows/poster_vid10.jpg"),
    ("public/products-assets/windows/video_2026-09-26_07-36-00 (11).mp4", "public/products-assets/windows/poster_vid11.jpg"),
    ("public/products-assets/windows/video_2026-09-26_07-36-00 (3).mp4", "public/products-assets/windows/poster_vid3.jpg"),
    ("public/products-assets/windows/video_2026-09-26_07-36-00 (4).mp4", "public/products-assets/windows/poster_vid4.jpg"),
    ("public/products-assets/windows/video_2026-09-26_07-36-00 (5).mp4", "public/products-assets/windows/poster_vid5.jpg"),
    ("public/products-assets/windows/video_2026-09-26_07-36-00 (6).mp4", "public/products-assets/windows/poster_vid6.jpg"),
    ("public/products-assets/windows/video_2026-09-26_07-36-00 (7).mp4", "public/products-assets/windows/poster_vid7.jpg"),
    ("public/products-assets/windows/video_2026-09-26_07-36-00 (9).mp4", "public/products-assets/windows/poster_vid9.jpg"),
    ("public/products-assets/windows/video_2026-09-26_07-36-00.mp4", "public/products-assets/windows/poster_vid_main.jpg"),
    ("public/products-assets/unclears/video_2026-09-26_07-36-00 (8).mp4", "public/products-assets/unclears/poster_unclear_vid8.jpg"),
    ("public/products-assets/unclears/WhatsApp Video 2026-10-30 at 6.19.54 PM.mp4", "public/products-assets/unclears/poster_unclear_tower_balconies.jpg"),
    ("public/products-assets/unclears/WhatsApp Video 2026-10-25 at 5.10.04 PM (1).mp4", "public/products-assets/unclears/poster_unclear_patio_enclosure.jpg"),
]

for src, dst in videos:
    if os.path.exists(src):
        # Extract at 1.5s or 0.5s
        cmd = ["ffmpeg", "-ss", "00:00:01", "-i", src, "-vframes", "1", "-q:v", "2", dst, "-y"]
        res = subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        if os.path.exists(dst) and os.path.getsize(dst) > 1000:
            print(f"Extracted poster {dst} ({os.path.getsize(dst)} bytes)")
        else:
            # retry at 0.2s
            cmd = ["ffmpeg", "-ss", "00:00:00.200", "-i", src, "-vframes", "1", "-q:v", "2", dst, "-y"]
            subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            print(f"Extracted poster (retry) {dst} ({os.path.getsize(dst)} bytes)")

# Also ensure /uploads/poster_slot11.jpg is synced with poster_vid10.jpg
if os.path.exists("public/products-assets/windows/poster_vid10.jpg"):
    subprocess.run(["cp", "public/products-assets/windows/poster_vid10.jpg", "uploads/poster_slot11.jpg"])
    print("Updated uploads/poster_slot11.jpg")
