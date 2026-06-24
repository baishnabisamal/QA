# Lab 0.1-Network Fundamentals

## Wireshark .pcap file with annotated login capture

<img width="1920" height="923" alt="Screenshot (398)" src="https://github.com/user-attachments/assets/4fe0d890-7038-4f4e-93bc-f3b9c63f12bb" />

## Curl Output:
<img width="1467" height="742" alt="Screenshot (400)" src="https://github.com/user-attachments/assets/a20d64d4-0822-4414-8536-d963b2d0bfb4" />
<img width="1484" height="775" alt="Screenshot (402)" src="https://github.com/user-attachments/assets/bded836b-c967-4b74-a5ca-095480b7493c" />


## 200-word VPN vs ZTNA comparison from a QA perspective
VPN vs ZTNA — A QA Perspective
Traffic Exposed:

A traditional VPN grants access to the entire corporate network once a user authenticates. Any device inside the VPN tunnel can potentially reach all internal IP ranges, servers, and services. This creates a large attack surface. Instasafe ZTNA operates differently — it exposes only the specific application or resource the authenticated user is explicitly authorised to access. No broader network visibility is granted, meaning lateral movement is impossible by design.
Where the Tunnel Terminates:

In a VPN, the encrypted tunnel terminates at a central VPN gateway on the corporate network perimeter. All user traffic routes through this single point. In Instasafe ZTNA, the tunnel terminates at an Instasafe connector deployed directly alongside the specific application. There is no corporate perimeter traversal — the user connects directly to the app via the Instasafe cloud gateway.
QA Implications:

For VPN testing, QA can verify network-level connectivity, ping internal hosts, and observe broad traffic patterns in Wireshark. For ZTNA testing, QA can only observe application-layer traffic to specifically authorised apps — network-level reconnaissance is impossible by design. This means QA must focus on application access control, session token validation, policy enforcement, and verifying that unauthorised resource access returns 403 responses rather than testing network reachability. ZTNA shifts QA testing from network testing to identity and policy testing.
