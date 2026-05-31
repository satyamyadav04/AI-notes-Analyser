import dns from "dns";

dns.resolveSrv(
  "_mongodb._tcp.ainotes.y7vgwj8.mongodb.net",
  (err, records) => {
    console.log("ERROR:", err);
    console.log("RECORDS:", records);
  }
);