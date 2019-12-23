package com.cb.javaSdkDemo.entities;

import com.couchbase.client.core.deps.com.fasterxml.jackson.annotation.JsonCreator;
import com.couchbase.client.core.deps.com.fasterxml.jackson.annotation.JsonGetter;
import com.couchbase.client.core.deps.com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public class Brewery {
    private final List<String> address;
    private final String city;
    private final int code;
    private final String country;
    private final String description;
    private final Geo geo;
    private final String name;
    private final String phone;
    private final String state;
    private final String type = "brewery";
    private final String updated;
    private final String website;

    @JsonCreator
    Brewery(@JsonProperty("address") List<String> address, @JsonProperty("city") String city,
            @JsonProperty("code") int code, @JsonProperty("country") String country,
            @JsonProperty("description") String description, 
            @JsonProperty("geo") Geo geo,
            @JsonProperty("name") String name,
            @JsonProperty("phone") String phone, @JsonProperty("state") String state,
            @JsonProperty("updated") String updated, @JsonProperty("website") String website) {

        this.address = address;
        this.city = city;
        this.code = code;
        this.country = country;
        this.description = description;
        this.geo = geo;
        this.name = name;
        this.phone = phone;
        this.state = state;
        this.updated = updated;
        this.website = website;
    }
  
    @JsonGetter
    public List<String> address() {
      return address;
    }

    @JsonGetter
    public String city() {
      return city;
    }

    @JsonGetter
    public int code() {
      return code;
    }

    @JsonGetter
    public String country() {
      return country;
    }

    @JsonGetter
    public String description() {
      return description;
    }

    @JsonGetter
    public Geo geo() {
      return geo;
    }

    @JsonGetter
    public String name() {
      return name;
    }

    @JsonGetter
    public String phone() {
      return phone;
    }

    @JsonGetter
    public String state() {
      return state;
    }
  
    @JsonGetter
    public String type() {
      return type;
    }

    @JsonGetter
    public String updated() {
      return updated;
    }

    @JsonGetter
    public String website() {
      return website;
    }

    static class Geo {

        private final String accuracy;
        private final double lat;
        private final double lon;

        @JsonCreator
        Geo(@JsonProperty("accuracy") String accuracy, @JsonProperty("lat") double lat,
                @JsonProperty("lon") double lon) {
            this.accuracy = accuracy;
            this.lat = lat;
            this.lon = lon;
        }

        @JsonGetter
        public String accuracy() {
            return accuracy;
        }

        @JsonGetter
        public double lat() {
            return lat;
        }

        @JsonGetter
        public double lon() {
            return lon;
        }
    }
}