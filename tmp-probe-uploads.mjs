const probe = async () => {
  const png = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
    "base64"
  );
  const form = new FormData();
  form.append("file", new Blob([png], { type: "image/png" }), "probe.png");
  const res = await fetch("https://saajpartnersandconsult.vercel.app/api/uploads", {
    method: "POST",
    body: form,
  });
  console.log("status:", res.status);
  console.log("body:", await res.text());
};
probe().catch((e) => {
  console.error(e);
  process.exit(1);
});