from datetime import datetime

dt1 = datetime(2023, 6, 13, 21, 0, 0)
dt2 = datetime(2023, 6, 15, 21, 0, 0)
dt3 = datetime(2023, 6, 16, 20, 59, 0)
dt4 = datetime(2023, 6, 17, 20, 59, 0)

# Check if dt2 is between dt1 and dt4
if dt1 < dt2 < dt4:
    print("dt2 is between dt1 and dt4")
else:
    print("dt2 is not between dt1 and dt4")

# Check if dt3 is between dt1 and dt4
if dt1 < dt3 < dt4:
    print("dt3 is between dt1 and dt4")
else:
    print("dt3 is not between dt1 and dt4")