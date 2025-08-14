import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, voice_name = 'Brian', model_id = 'eleven_turbo_v2_5', output_format = 'mp3_44100_128' } = body;

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    // Use the MCP server tool for text-to-speech
    const response = await fetch('http://localhost:3001/mcp/text-to-speech', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        voice_name,
        model_id,
        output_format,
        speed: 1.0,
        stability: 0.5,
        similarity_boost: 0.75,
      }),
    });

    if (!response.ok) {
      console.error('Eleven Labs API error:', await response.text());
      return NextResponse.json({ error: 'Speech generation failed' }, { status: 500 });
    }

    // Get the audio file path from the response
    const result = await response.json();

    // If the MCP server returns a file path, read and return the audio file
    if (result.file_path) {
      try {
        const fs = await import('fs/promises');
        const audioBuffer = await fs.readFile(result.file_path);

        // Clean up the temporary file
        await fs.unlink(result.file_path).catch(() => { }); // Ignore errors

        return new NextResponse(new Uint8Array(audioBuffer), {
          headers: {
            'Content-Type': 'audio/mpeg',
            'Content-Length': audioBuffer.length.toString(),
          },
        });
      } catch (fileError) {
        console.error('Error reading audio file:', fileError);
        return NextResponse.json({ error: 'Audio file not found' }, { status: 500 });
      }
    }

    return NextResponse.json({ error: 'No audio file generated' }, { status: 500 });
  } catch (error) {
    console.error('Speech generation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
