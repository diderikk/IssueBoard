class Group < ApplicationRecord
	has_and_belongs_to_many :users
	has_many :issue_boards

	validates :name, presence: true
	validates :logo, presence: false, allow_nil: true
end
