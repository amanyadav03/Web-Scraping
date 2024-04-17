import sys
import requests
import json
from flask_cors import CORS
from bs4 import BeautifulSoup
from flask import Flask, jsonify, Response, request

app = Flask(__name__)
CORS(app, allow_headers=['Content-Type'], origins=['http://127.0.0.1:5501', 'http://localhost:5501'])

@app.route('/scrape', methods=['GET'])
def scrape_data():
    try:
        url = request.args.get('url')
        content_type= request.args.get('content_type')
        if not url:
            return Response(
                response=json.dumps({'error': 'URL parameter is missing'}),
                status=400,
                mimetype='application/json'
            )

        try:
            response = requests.get(url)
            response.raise_for_status()
        except requests.exceptions.RequestException as e:
            return Response(
                response=json.dumps({'error': f'Error fetching URL: {e}'}),
                status=502,
                mimetype='application/json'
            )

        try:
            soup = BeautifulSoup(response.content, "html.parser")
            if content_type == 'text':
                data = {"text_content": soup.get_text()}
            elif content_type == 'titles' or content_type == 'headings':
                titles = [title.text for title in soup.find_all(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'])]
                data = {"titles": titles}
            elif content_type == 'paragraphs':
                paragraphs = [paragraph.text for paragraph in soup.find_all('p')]
                data = {"paragraphs": paragraphs}
            elif content_type == 'html':
                data = {"html_content": str(soup)}
            else:
                # If content type is not recognized, return an error
                return Response(
                    response=json.dumps({'error': 'Invalid content type'}),
                    status=400,
                    mimetype='application/json')
            
            response = Response(
                response=json.dumps(data),
                status=200,
                mimetype='application/json'
            )

            # Set cache-control headers for better cache handling
            response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
            response.headers['Pragma'] = 'no-cache'
            response.headers['Expires'] = '0'

            return response

        except Exception as e:
            return Response(
                response=json.dumps({'error': str(e)}),
                status=500,
                mimetype='application/json'
            )

    except Exception as e:
        return Response(
            response=json.dumps({'error': f'Invalid request: {e}'}),
            status=400,
            mimetype='application/json'
        )

if __name__ == '__main__':
    app.run(debug=True)
