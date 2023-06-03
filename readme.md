# The Approach
## Approach to the project v-1.0
- I already know that we can get face landmarks using all sorts of libraries
- I also know that I can import any rigged 3D model and manipulate them
- the biggest challenge is in moving the bones of the 3D model to match the face landmarks
  - this needs to be tackled first.

## Approach to the project v-1.1
Now objects can be moved using bones. And I have been able to move the bones using the face landmarks. 
- The next step is to make the movement of the bones more natural. 
 - Adjusting weight painting can go a long way
 - Animations can be used to make the movement more natural

A good idea would be to use face-points to only move the lips and the eyeballs. since these movements are the most important interms of keeping it "real-time". other movements such as the eyebrows and the jaw can be done using **animations** with the help of the **categorie** data that we get. 

## Useful Resources found so far
- [Easy mouth rig in Blender](https://www.youtube.com/watch?v=6nmT123wVe4)
- [Creating bone handles that moves on a 2d plane](https://www.youtube.com/watch?v=pCcHi-az8Ts)
- [Media pipe face point implementation](https://codepen.io/mediapipe-preview/pen/OJBVQJm)