// We removed imports because MediaPipe attaches to window globally

export function initVision(appState) {
    const videoElement = document.getElementById('input-video');
    const statusDot = document.getElementById('status-dot');

    function onResults(results) {
        statusDot.classList.add('active');
        
        const { handData } = appState;
        
        if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
            handData.isHandPresent = true;
            const landmarks = results.multiHandLandmarks[0];
            
            // Mirrored Camera Control
            const rawX = landmarks[0].x;
            handData.rawX = (1.0 - rawX) * window.innerWidth; 
            
            handData.rawY = landmarks[0].y * window.innerHeight;
            handData.rawZ = landmarks[0].z; 

            // Improved Fist Detection
            const wrist = landmarks[0];
            const tips = [8, 12, 16, 20];
            const pips = [6, 10, 14, 18];
            let foldedCount = 0;
            
            for(let i=0; i<tips.length; i++) {
                const tipDist = Math.hypot(landmarks[tips[i]].x - wrist.x, landmarks[tips[i]].y - wrist.y);
                const pipDist = Math.hypot(landmarks[pips[i]].x - wrist.x, landmarks[pips[i]].y - wrist.y);
                if (tipDist < pipDist * 0.8) foldedCount++;
            }
            
            const thumbTipDist = Math.hypot(landmarks[4].x - wrist.x, landmarks[4].y - wrist.y);
            if (thumbTipDist < 0.15) foldedCount++;

            handData.isFist = foldedCount >= 3;

        } else {
            handData.isHandPresent = false;
            handData.isFist = false;
        }
    }

    // Using global Hands and Camera objects provided by the script tags
    const hands = new Hands({locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
    }});

    hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
    });

    hands.onResults(onResults);

    // Setup Camera
    const cameraUtils = new Camera(videoElement, {
        onFrame: async () => {
            await hands.send({image: videoElement});
        },
        width: 640,
        height: 480
    });

    appState.visionCamera = cameraUtils;
}