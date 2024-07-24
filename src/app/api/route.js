import { spawn } from 'child_process';

export async function GET(request) {
    return new Response('Hello, from API!');
}

export async function POST(request) {
    const body = await request.json();
    const { image, direction, dragDirection, dragPosition } = body;

    const data = JSON.stringify({ image, direction, dragDirection, dragPosition });

    const pythonProcess = spawn('python', ['src/app/api/app.py']);

    return new Promise((resolve, reject) => {
        let output = '';

        pythonProcess.stdin.write(data);
        pythonProcess.stdin.end();

        pythonProcess.stdout.on('data', (data) => {
            output += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
        });

        pythonProcess.on('close', (code) => {
            if (code !== 0) {
                return reject(new Error(`Process exited with code: ${code}`));
            }
            resolve(new Response(output, {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            }));
        });
    });
}
