import sys
import json
import base64
from PIL import Image
from io import BytesIO

def horizontal_line(image, dragDirection, dragPosition):
    y = image.height
    x = image.width
    line_height = int((dragPosition / 100) * y)

    if dragDirection == "down":
        for row in range(x):
            line_pixel = image.getpixel((row, line_height))
            for column in range(line_height, y):
                image.putpixel((row, column), line_pixel)
    elif dragDirection == "up":
        for row in range(x):
            line_pixel = image.getpixel((row, line_height))
            for column in range(line_height, -1, -1):
                image.putpixel((row, column), line_pixel)

    return image

def vertical_line(image, dragDirection, dragPosition):
    y = image.height
    x = image.width
    line_width = int((dragPosition / 100) * x)

    if dragDirection == "right":
        for column in range(y):
            line_pixel = image.getpixel((line_width, column))
            for row in range(line_width, x):
                image.putpixel((row, column), line_pixel)
    elif dragDirection == "left":
        for column in range(y):
            line_pixel = image.getpixel((line_width, column))
            for row in range(line_width, -1, -1):
                image.putpixel((row, column), line_pixel)

    return image

def yx_line(image):
    y = image.height
    x = image.width

    if x >= y:
        for row in range(x):
            column = abs(int(y - (row * (y/x))) - 1)
            line_pixel = image.getpixel((row, column))
            for drag in range(row, x):
                image.putpixel((drag, column), line_pixel)
    else:
        for column in range(y):
            row = abs(int(x - (column * (x/y))) - 1)
            line_pixel = image.getpixel((row, column))
            for drag in range(row, x):
                image.putpixel((drag, column), line_pixel)

    return image

def main():
    # Read input from stdin
    input_data = sys.stdin.read()
    data = json.loads(input_data)

    # Extract data
    base_string = data.get('image')
    direction = data.get('direction')
    dragDirection = data.get('dragDirection')
    dragPosition = data.get('dragPosition')

    # Extract the image format from the Base64 header
    format_str = base_string.split(';')[0].split('/')[1].upper()

    # Remove Base64 header if present
    if base_string.startswith('data:image'):
        base_string = base_string.split(',', 1)[1]

    # Decode the Base64 string
    image_data = base64.b64decode(base_string)

    # Open the image
    image = Image.open(BytesIO(image_data))

    # Process the image (example)
    if direction == "horizontal":
        horizontal_line(image, dragDirection, dragPosition)
    elif direction == "vertical":
        vertical_line(image, dragDirection, dragPosition)
    elif direction == 'y=x':
        yx_line(image)

    # Convert the processed image back to Base64
    buffered = BytesIO()
    if format_str == "HEIC":
        format_str = "JPEG"
    image.save(buffered, format=format_str)
    processed_image_string = base64.b64encode(buffered.getvalue()).decode("utf-8")

    # Add Base64 header back to the processed image string
    result_image = f"data:image/{format_str.lower()};base64,{processed_image_string}"

    # Prepare the result
    result = {
        'processed_image': result_image
    }

    # Print result as JSON
    print(json.dumps(result))


if __name__ == "__main__":
    main()
