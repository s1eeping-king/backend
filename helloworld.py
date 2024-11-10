from flask import Flask,render_template
import os
import subprocess
from flask import request
from flask_cors import cross_origin
# 执行一个简单的系统命令


app = Flask(__name__)
@app.route('/register')
@cross_origin()
def _():
    try:
        result = subprocess.run(['node',"ts/src/register.js"], capture_output=True, text=True, check=True)
        return result.stdout
    except subprocess.CalledProcessError as e:
        return str(e.stdout)
@app.route('/api/move',methods=['POST'])
@cross_origin()
def _1():

    direction=request.get_json()
    direction = direction.get('direction')
    print(direction)
    try:
        result = subprocess.run(['node',"ts/src/movement.js"], capture_output=True, text=True, check=True)
        print(result)
        return result.stdout
    except subprocess.CalledProcessError as e:
        return str(e.stdout)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=int(os.environ.get('PORT', 8080)))
