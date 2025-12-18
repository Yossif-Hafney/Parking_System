package utils;


import java.util.HashMap;
import java.util.Map;


/**
* Very small "JSON" parser for simple flat objects like {"plate":"ABC","color":"red","type":"car"}
* This is NOT a full JSON parser. It is intentionally simple to avoid external dependencies.
* It handles strings and simple values without nested objects or arrays.
*/
public class JsonUtil {
public static Map<String, String> parseSimpleJson(String s) {
Map<String, String> map = new HashMap<>();
if (s == null) return map;
s = s.trim();
if (s.startsWith("{")) s = s.substring(1);
if (s.endsWith("}")) s = s.substring(0, s.length() - 1);


// split by commas that are not inside quotes
StringBuilder token = new StringBuilder();
boolean inQuotes = false;
java.util.List<String> parts = new java.util.ArrayList<>();
for (int i = 0; i < s.length(); i++) {
char c = s.charAt(i);
if (c == '"') inQuotes = !inQuotes;
if (c == ',' && !inQuotes) {
parts.add(token.toString());
token.setLength(0);
} else {
token.append(c);
}
}
if (token.length() > 0) parts.add(token.toString());


for (String p : parts) {
String[] kv = p.split(":", 2);
if (kv.length != 2) continue;
String key = kv[0].trim();
String val = kv[1].trim();
key = stripQuotes(key);
val = stripQuotes(val);
map.put(key, val);
}
return map;
}


private static String stripQuotes(String s) {
s = s.trim();
if (s.startsWith("\"")) s = s.substring(1);
if (s.endsWith("\"")) s = s.substring(0, s.length() - 1);
return s;
}
}