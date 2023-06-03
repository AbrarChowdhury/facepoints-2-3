# Blender Learning Notes
## Steps to create a bone handler

1. Create a bone normally
2. Shift + D to duplicate the bone
3. Rename the bone to something like "abc-target"
4. Rotate the bone to keep it perpendicular to the plane you want to move the bone on
5. Switch to pose mode
6. Select the that needs to be controlled
7. Go to "bone constraint properties" on the right side panel
    - add bone constraints
    - select "track to"
    - set
      - target to "armature"
      - bone to "abc-target"
      - track axis to "Y"
      - up axis to "Z"  