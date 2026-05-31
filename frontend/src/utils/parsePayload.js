const parsePayload = (payload) => {
  if (!payload) {
    return null;
  }

  if (typeof payload === "object") {
    return payload;
  }

  try {
    return JSON.parse(payload);
  } catch (_error) {
    return { raw: payload };
  }
};

export default parsePayload;
