// ISI UNTUK: functions/[[path]]/index.js (FILE BARU)

export async function onRequest(context) {
  try {
    // 1. Buat URL lengkap menuju file 404.html statismu
    const url404 = new URL('/404.html', context.request.url);

    // 2. Ambil (fetch) file HTML itu dari aset statismu
    const response404 = await fetch(url404);

    // 3. Kembalikan file HTML itu, tapi dengan status 404
    return new Response(response404.body, {
      status: 404, // <-- Tetap kirim status 404 yang benar
      headers: response404.headers
    });
    
  } catch (err) {
    // Kalau gagal (misal file 404.html-nya juga tidak ada)
    return new Response('Halaman tidak ditemukan, dan halaman 404 juga rusak.', { 
        status: 404 
    });
  }
}
