conda create -n clip_env python=3.11
conda activate clip_env
pip3 install numpy==1.23.5
pip3 install torch torchvision torchaudio
pip3 install git+https://github.com/openai/CLIP.git
pip3 install faiss-cpu
pip3 install flask flask-cors pillow 
